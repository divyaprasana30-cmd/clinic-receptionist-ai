import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { sendWhatsAppMessage } from "@/lib/twilio/client";
import { redis, getConversationKey, CONVERSATION_TTL } from "@/lib/redis/client";
import { ConversationSession, MessageIntent } from "@/types/conversation";
import { getAvailableSlots, createAppointment } from "@/lib/scheduling/slot-engine";
import { sendBookingConfirmation } from "@/lib/resend/client";

async function parseTwilioBody(req: NextRequest): Promise<Record<string, string>> {
  const text = await req.text();
  const params: Record<string, string> = {};
  new URLSearchParams(text).forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

function getNextDays(count: number): string[] {
  const days = [];
  for (let i = 1; i <= count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function parseUserDate(message: string): string | null {
  const lower = message.toLowerCase().trim();
  const today = new Date();

  if (lower.includes("tomorrow")) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }

  if (lower.includes("today")) {
    return today.toISOString().split("T")[0];
  }

  const dayNames = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  for (let i = 0; i < dayNames.length; i++) {
    if (lower.includes(dayNames[i])) {
      const d = new Date(today);
      const diff = (i - d.getDay() + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
      return d.toISOString().split("T")[0];
    }
  }

  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  for (let m = 0; m < months.length; m++) {
    if (lower.includes(months[m])) {
      const numMatch = lower.match(/\d+/);
      if (numMatch) {
        const year = today.getFullYear();
        const d = new Date(year, m, parseInt(numMatch[0]));
        return d.toISOString().split("T")[0];
      }
    }
  }

  return null;
}

function parseUserTime(message: string): string | null {
  const lower = message.toLowerCase().trim();
  const match = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
  if (!match) return null;

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2] || "0");
  const period = match[3];

  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function patientPhoneToName(phone: string): string {
  return `Patient ${phone.slice(-4)}`;
}

export async function POST(req: NextRequest) {
  try {
    const params = await parseTwilioBody(req);
    const { Body, From, To, MessageSid } = params;

    if (!Body || !From) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const patientPhone = From.replace("whatsapp:", "");
    const clinicWhatsapp = To.replace("whatsapp:", "");

    console.log(`Incoming from ${patientPhone}: ${Body}`);

    const supabase = await createAdminSupabaseClient();

    let clinic = null;
    const { data: clinicData } = await supabase
      .from("clinics")
      .select("*")
      .eq("whatsapp_number", clinicWhatsapp)
      .single();

    if (!clinicData) {
      const { data: firstClinic } = await supabase
        .from("clinics")
        .select("*")
        .limit(1)
        .single();
      clinic = firstClinic;
    } else {
      clinic = clinicData;
    }

    if (!clinic) {
      return NextResponse.json({ error: "No clinic found" }, { status: 404 });
    }

    const conversationKey = getConversationKey(clinic.id, patientPhone);
    let session = await redis.get<ConversationSession>(conversationKey);

    if (!session) {
      session = {
        clinic_id: clinic.id,
        patient_phone: patientPhone,
        patient_name: null,
        state: "new",
        intent: null,
        doctor_id: null,
        selected_date: null,
        selected_time: null,
        appointment_id: null,
        message_count: 0,
        last_message_at: new Date().toISOString(),
      };
    }

    session.message_count += 1;
    session.last_message_at = new Date().toISOString();

    const { data: conversation } = await supabase
      .from("conversations")
      .upsert({
        clinic_id: clinic.id,
        patient_phone: patientPhone,
        state: session.state,
        message_count: session.message_count,
        last_message_at: session.last_message_at,
      }, { onConflict: "clinic_id,patient_phone" })
      .select()
      .single();

    if (conversation) {
      await supabase.from("messages").insert({
        clinic_id: clinic.id,
        conversation_id: conversation.id,
        direction: "inbound",
        content: Body,
        whatsapp_message_id: MessageSid,
      });
    }

    if (session.state === "human_handoff") {
      await redis.set(conversationKey, session, { ex: CONVERSATION_TTL });
      return NextResponse.json({ status: "human_handoff" });
    }

    const reply = await generateReply(session, Body, clinic, supabase);

    await sendWhatsAppMessage(patientPhone, reply.message);

    session.state = reply.nextState;
    if (reply.intent) session.intent = reply.intent;
    if (reply.selectedDate) session.selected_date = reply.selectedDate;
    if (reply.selectedTime) session.selected_time = reply.selectedTime;
    if (reply.doctorId) session.doctor_id = reply.doctorId;
    if (reply.patientName) session.patient_name = reply.patientName;
    if (reply.appointmentId) session.appointment_id = reply.appointmentId;

    await redis.set(conversationKey, session, { ex: CONVERSATION_TTL });

    if (conversation) {
      await supabase.from("messages").insert({
        clinic_id: clinic.id,
        conversation_id: conversation.id,
        direction: "outbound",
        content: reply.message,
      });
      await supabase
        .from("conversations")
        .update({ state: reply.nextState })
        .eq("id", conversation.id);
    }

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("Webhook error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function generateReply(
  session: ConversationSession,
  message: string,
  clinic: any,
  supabase: any
): Promise<{
  message: string;
  nextState: ConversationSession["state"];
  intent?: MessageIntent;
  selectedDate?: string;
  selectedTime?: string;
  doctorId?: string;
  patientName?: string;
  appointmentId?: string;
}> {
  const lower = message.toLowerCase().trim();

  if (session.state === "new" || session.message_count === 1) {
    return {
      message: `👋 Welcome to *${clinic.name}*!\n\nI'm your AI receptionist. How can I help?\n\n1️⃣ Book appointment\n2️⃣ Cancel appointment\n3️⃣ Reschedule\n4️⃣ Talk to receptionist\n\nReply with a number!`,
      nextState: "awaiting_intent",
    };
  }

  if (session.state === "awaiting_intent") {
    if (lower.includes("1") || lower.includes("book")) {
      const dates = getNextDays(5);
      let slotsFound = false;
      let dateList = "";

      for (let i = 0; i < dates.length; i++) {
        const slots = await getAvailableSlots(clinic.id, dates[i]);
        if (slots.length > 0) {
          dateList += `${i + 1}️⃣ ${formatDate(dates[i])} (${slots.length} slots)\n`;
          slotsFound = true;
        }
      }

      if (!slotsFound) {
        return {
          message: `Sorry, no available slots in the next 5 days. Please call us directly.`,
          nextState: "awaiting_intent",
        };
      }

      return {
        message: `📅 *Available dates:*\n\n${dateList}\nWhich date works for you?`,
        nextState: "awaiting_date",
        intent: "book_appointment",
      };
    }

    if (lower.includes("2") || lower.includes("cancel")) {
      return {
        message: `I'll help you cancel. Please share your appointment date or name.`,
        nextState: "awaiting_date",
        intent: "cancel_appointment",
      };
    }

    if (lower.includes("3") || lower.includes("reschedule")) {
      return {
        message: `Sure! What was your original appointment date?`,
        nextState: "awaiting_date",
        intent: "reschedule_appointment",
      };
    }

    if (lower.includes("4") || lower.includes("human") || lower.includes("receptionist")) {
      return {
        message: `Connecting you to our receptionist. Please hold! 🙏`,
        nextState: "human_handoff",
        intent: "human_support",
      };
    }

    return {
      message: `Please reply with:\n1️⃣ Book\n2️⃣ Cancel\n3️⃣ Reschedule\n4️⃣ Human`,
      nextState: "awaiting_intent",
    };
  }

  if (session.state === "awaiting_date" && session.intent === "book_appointment") {
    let selectedDate: string | null = null;

    const numMatch = message.trim().match(/^[1-5]$/);
    if (numMatch) {
      const dates = getNextDays(5);
      const idx = parseInt(numMatch[0]) - 1;
      selectedDate = dates[idx];
    } else {
      selectedDate = parseUserDate(message);
    }

    if (!selectedDate) {
      return {
        message: `Sorry I didn't understand. Please say *tomorrow*, *Monday*, or *26 May*.`,
        nextState: "awaiting_date",
      };
    }

    const slots = await getAvailableSlots(clinic.id, selectedDate);

    if (slots.length === 0) {
      return {
        message: `No slots on ${formatDate(selectedDate)}. Please choose another date.`,
        nextState: "awaiting_date",
      };
    }

    const uniqueTimes = [...new Set(slots.map((s) => s.time))].slice(0, 8);
    let slotList = "";
    uniqueTimes.forEach((time, i) => {
      slotList += `${i + 1}️⃣ ${time}\n`;
    });

    return {
      message: `✅ *${formatDate(selectedDate)}* — Available slots:\n\n${slotList}\nReply with number or time.`,
      nextState: "awaiting_slot",
      selectedDate,
      doctorId: slots[0].doctor_id,
    };
  }

  if (session.state === "awaiting_slot") {
    const date = session.selected_date!;
    const slots = await getAvailableSlots(clinic.id, date);
    const uniqueTimes = [...new Set(slots.map((s) => s.time))].slice(0, 8);

    let selectedTime: string | null = null;

    const numMatch = message.trim().match(/^(\d+)$/);
    if (numMatch) {
      const idx = parseInt(numMatch[0]) - 1;
      if (idx >= 0 && idx < uniqueTimes.length) {
        selectedTime = uniqueTimes[idx];
      }
    } else {
      selectedTime = parseUserTime(message);
    }

    if (!selectedTime) {
      return {
        message: `Please reply with a number or time like *10am*.`,
        nextState: "awaiting_slot",
      };
    }

    const slot = slots.find((s) => s.time === selectedTime);
    if (!slot) {
      return {
        message: `That slot isn't available. Please choose from the list.`,
        nextState: "awaiting_slot",
      };
    }

    return {
      message: `Please confirm:\n\n👨‍⚕️ *${slot.doctor_name}*\n📅 *${formatDate(date)}*\n⏰ *${selectedTime}*\n🏥 *${clinic.name}*\n\nReply *YES* to confirm or *NO* to cancel.`,
      nextState: "awaiting_confirmation",
      selectedTime,
      doctorId: slot.doctor_id,
    };
  }

  if (session.state === "awaiting_confirmation") {
    if (lower === "yes" || lower === "y") {
      try {
        const appointment = await createAppointment({
          clinicId: clinic.id,
          doctorId: session.doctor_id!,
          patientName: session.patient_name || patientPhoneToName(session.patient_phone),
          patientPhone: session.patient_phone,
          date: session.selected_date!,
          time: session.selected_time!,
        });

        // Get doctor name
        const { data: doctor } = await supabase
          .from("doctors")
          .select("name")
          .eq("id", session.doctor_id!)
          .single();

        // Send confirmation email
        try {
          await sendBookingConfirmation({
            to: clinic.email,
            patientName: session.patient_name || patientPhoneToName(session.patient_phone),
            doctorName: doctor?.name || "Doctor",
            date: formatDate(session.selected_date!),
            time: session.selected_time!,
            clinicName: clinic.name,
          });
          console.log("Confirmation email sent!");
        } catch (emailError) {
          console.error("Email error:", emailError);
        }

        return {
          message: `✅ *Appointment Confirmed!*\n\n📅 ${formatDate(session.selected_date!)}\n⏰ ${session.selected_time}\n🏥 ${clinic.name}\n\nConfirmation sent. See you soon! 🙏`,
          nextState: "confirmed",
          appointmentId: appointment.id,
        };
      } catch (error: any) {
        return {
          message: `Sorry, that slot was just taken. What date works for you?`,
          nextState: "awaiting_date",
        };
      }
    }

    return {
      message: `Booking cancelled.\n\nReply *1* to start over anytime.`,
      nextState: "awaiting_intent",
    };
  }

  if (session.state === "confirmed") {
    return {
      message: `Your appointment is confirmed! 🎉\n\n1️⃣ Book another\n2️⃣ Cancel\n4️⃣ Talk to receptionist`,
      nextState: "awaiting_intent",
    };
  }

  return {
    message: `Reply with:\n1️⃣ Book\n2️⃣ Cancel\n3️⃣ Reschedule\n4️⃣ Human`,
    nextState: "awaiting_intent",
  };
}
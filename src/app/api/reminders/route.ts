import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { sendWhatsAppMessage } from "@/lib/twilio/client";
import { resend } from "@/lib/resend/client";

export async function POST(req: NextRequest) {
  try {
    const { hours_before } = await req.json();
    const supabase = await createAdminSupabaseClient();

    const now = new Date();
    const targetTime = new Date(now.getTime() + hours_before * 60 * 60 * 1000);
    const targetDate = targetTime.toISOString().split("T")[0];
    const targetHour = targetTime.getHours();
    const targetMinute = targetTime.getMinutes();

    // Find appointments at target time
    const { data: appointments } = await supabase
      .from("appointments")
      .select(`
        *,
        doctors (name, whatsapp_number, email),
        clinics (name, phone)
      `)
      .eq("appointment_date", targetDate)
      .eq("status", "confirmed")
      .gte("appointment_time", `${String(targetHour).padStart(2, "0")}:${String(targetMinute).padStart(2, "0")}:00`)
      .lt("appointment_time", `${String(targetHour).padStart(2, "0")}:${String(targetMinute + 5).padStart(2, "0")}:00`);

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ message: "No appointments found", count: 0 });
    }

    const results = [];

    for (const appt of appointments) {
      const doctor = appt.doctors as any;
      const clinic = appt.clinics as any;
      const timeLabel = hours_before === 24 ? "tomorrow" : "in 1 hour";

      // 1. Send WhatsApp reminder to PATIENT
      try {
        await sendWhatsAppMessage(
          appt.patient_phone,
          `🔔 *Appointment Reminder*\n\nHi ${appt.patient_name}!\n\nYou have an appointment *${timeLabel}*:\n\n👨‍⚕️ Dr. ${doctor?.name}\n📅 ${appt.appointment_date}\n⏰ ${appt.appointment_time?.slice(0, 5)}\n🏥 ${clinic?.name}\n\nPlease reply *CONFIRM* to confirm or *CANCEL* to cancel.`
        );
      } catch (e) {
        console.error("Patient WhatsApp error:", e);
      }

      // 2. Send WhatsApp reminder to DOCTOR
      if (doctor?.whatsapp_number) {
        try {
          await sendWhatsAppMessage(
            doctor.whatsapp_number,
            `📋 *Appointment Reminder*\n\nDr. ${doctor.name},\n\nYou have a patient ${timeLabel}:\n\n👤 ${appt.patient_name}\n📱 ${appt.patient_phone}\n⏰ ${appt.appointment_time?.slice(0, 5)}\n📅 ${appt.appointment_date}`
          );
        } catch (e) {
          console.error("Doctor WhatsApp error:", e);
        }
      }

      // 3. Send email reminder to PATIENT (if email exists)
      if (appt.patient_email) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: appt.patient_email,
            subject: `Reminder: Appointment ${timeLabel} — ${clinic?.name}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                <div style="background:#f59e0b;padding:20px;border-radius:10px 10px 0 0">
                  <h1 style="color:white;margin:0">⏰ Appointment Reminder</h1>
                </div>
                <div style="background:#f8fafc;padding:20px;border-radius:0 0 10px 10px;border:1px solid #e2e8f0">
                  <p>Hi <strong>${appt.patient_name}</strong>,</p>
                  <p>You have an appointment <strong>${timeLabel}</strong>.</p>
                  <table style="width:100%;border-collapse:collapse;background:white;padding:16px;border-radius:8px;border:1px solid #e2e8f0">
                    <tr><td style="padding:8px;color:#64748b">👨‍⚕️ Doctor</td><td style="padding:8px;font-weight:bold">Dr. ${doctor?.name}</td></tr>
                    <tr><td style="padding:8px;color:#64748b">📅 Date</td><td style="padding:8px;font-weight:bold">${appt.appointment_date}</td></tr>
                    <tr><td style="padding:8px;color:#64748b">⏰ Time</td><td style="padding:8px;font-weight:bold">${appt.appointment_time?.slice(0, 5)}</td></tr>
                    <tr><td style="padding:8px;color:#64748b">🏥 Clinic</td><td style="padding:8px;font-weight:bold">${clinic?.name}</td></tr>
                  </table>
                </div>
              </div>
            `,
          });
        } catch (e) {
          console.error("Email error:", e);
        }
      }

      // 4. Send email to DOCTOR
      if (doctor?.email) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL!,
            to: doctor.email,
            subject: `Patient appointment ${timeLabel} — ${appt.patient_name}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
                <h2>📋 Appointment ${timeLabel}</h2>
                <p>Dr. ${doctor.name},</p>
                <p>You have a patient appointment <strong>${timeLabel}</strong>:</p>
                <table style="width:100%;border-collapse:collapse">
                  <tr><td style="padding:8px;color:#64748b">👤 Patient</td><td style="padding:8px;font-weight:bold">${appt.patient_name}</td></tr>
                  <tr><td style="padding:8px;color:#64748b">📱 Phone</td><td style="padding:8px;font-weight:bold">${appt.patient_phone}</td></tr>
                  <tr><td style="padding:8px;color:#64748b">⏰ Time</td><td style="padding:8px;font-weight:bold">${appt.appointment_time?.slice(0, 5)}</td></tr>
                  <tr><td style="padding:8px;color:#64748b">📅 Date</td><td style="padding:8px;font-weight:bold">${appt.appointment_date}</td></tr>
                </table>
              </div>
            `,
          });
        } catch (e) {
          console.error("Doctor email error:", e);
        }
      }

      results.push({ id: appt.id, patient: appt.patient_name });
    }

    return NextResponse.json({
      message: `Reminders sent for ${results.length} appointments`,
      appointments: results
    });

  } catch (error) {
    console.error("Reminder error:", error);
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 });
  }
}
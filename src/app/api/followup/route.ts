import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { sendWhatsAppMessage } from "@/lib/twilio/client";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createAdminSupabaseClient();

    // Find appointments from exactly 7 days ago that are confirmed
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const targetDate = sevenDaysAgo.toISOString().split("T")[0];

    const { data: appointments } = await supabase
      .from("appointments")
      .select(`*, doctors (name), clinics (name)`)
      .eq("appointment_date", targetDate)
      .eq("status", "confirmed");

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ message: "No follow-ups needed", count: 0 });
    }

    const results = [];

    for (const appt of appointments) {
      const doctor = appt.doctors as any;
      const clinic = appt.clinics as any;

      try {
        await sendWhatsAppMessage(
          appt.patient_phone,
          `👋 Hi ${appt.patient_name}!\n\nHope your visit with *Dr. ${doctor?.name}* at *${clinic?.name}* went well!\n\nWould you like to book a follow-up appointment?\n\nReply *YES* to book or *NO* if you're all good! 😊`
        );

        // Mark appointment as completed
        await supabase
          .from("appointments")
          .update({ status: "completed" })
          .eq("id", appt.id);

        results.push({ id: appt.id, patient: appt.patient_name });
      } catch (e) {
        console.error("Follow-up error for", appt.patient_name, e);
      }
    }

    return NextResponse.json({
      message: `Follow-ups sent for ${results.length} patients`,
      appointments: results
    });

  } catch (error) {
    console.error("Follow-up error:", error);
    return NextResponse.json({ error: "Failed to send follow-ups" }, { status: 500 });
  }
}
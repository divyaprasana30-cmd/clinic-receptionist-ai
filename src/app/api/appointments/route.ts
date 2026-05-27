import { NextRequest, NextResponse } from "next/server";
import { createAppointment } from "@/lib/scheduling/slot-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clinic_id,
      doctor_id,
      patient_name,
      patient_phone,
      date,
      time,
    } = body;

    if (!clinic_id || !doctor_id || !patient_name || !patient_phone || !date || !time) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const appointment = await createAppointment({
      clinicId: clinic_id,
      doctorId: doctor_id,
      patientName: patient_name,
      patientPhone: patient_phone,
      date,
      time,
    });

    return NextResponse.json({ appointment, status: "confirmed" });
  } catch (error: any) {
    console.error("Appointment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create appointment" },
      { status: 500 }
    );
  }
}
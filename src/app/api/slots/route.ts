import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/scheduling/slot-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinic_id");
    const date = searchParams.get("date");

    if (!clinicId || !date) {
      return NextResponse.json(
        { error: "clinic_id and date are required" },
        { status: 400 }
      );
    }

    const slots = await getAvailableSlots(clinicId, date);
    return NextResponse.json({ slots, date, total: slots.length });

  } catch (error) {
    console.error("Slots error:", error);
    return NextResponse.json({ error: "Failed to get slots" }, { status: 500 });
  }
}
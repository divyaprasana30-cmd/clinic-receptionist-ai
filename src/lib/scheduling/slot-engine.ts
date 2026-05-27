import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { format, parse, addMinutes, isBefore } from "date-fns";

export type AvailableSlot = {
  time: string;
  doctor_id: string;
  doctor_name: string;
  duration_minutes: number;
};

export async function getAvailableSlots(
  clinicId: string,
  date: string
): Promise<AvailableSlot[]> {
  const supabase = await createAdminSupabaseClient();

  const [year, month, day] = date.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay();

  // Get schedules for this day
  const { data: schedules } = await supabase
    .from("doctor_schedules")
    .select("*")
    .eq("clinic_id", clinicId)
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true);

  if (!schedules || schedules.length === 0) return [];

  // Get doctors
  const doctorIds = schedules.map((s) => s.doctor_id);
  const { data: doctors } = await supabase
    .from("doctors")
    .select("*")
    .in("id", doctorIds)
    .eq("is_active", true);

  if (!doctors || doctors.length === 0) return [];

  // Get existing appointments
  const { data: existingAppointments } = await supabase
    .from("appointments")
    .select("appointment_time, doctor_id")
    .eq("clinic_id", clinicId)
    .eq("appointment_date", date)
    .in("status", ["pending", "confirmed"]);

  const bookedSlots = existingAppointments || [];
  const availableSlots: AvailableSlot[] = [];

  for (const schedule of schedules) {
    const doctor = doctors.find((d) => d.id === schedule.doctor_id);
    if (!doctor) continue;

    const startTime = parse(schedule.start_time, "HH:mm:ss", new Date());
    const endTime = parse(schedule.end_time, "HH:mm:ss", new Date());
    const slotDuration = schedule.slot_duration_minutes;

    let currentSlot = startTime;

    while (isBefore(currentSlot, endTime)) {
      const nextSlot = addMinutes(currentSlot, slotDuration);
      if (!isBefore(nextSlot, endTime) && nextSlot.getTime() !== endTime.getTime()) {
        break;
      }

      const slotTime = format(currentSlot, "HH:mm");

      const isBooked = bookedSlots.some(
        (appt) =>
          appt.doctor_id === doctor.id &&
          appt.appointment_time.startsWith(slotTime)
      );

      if (!isBooked) {
        availableSlots.push({
          time: slotTime,
          doctor_id: doctor.id,
          doctor_name: doctor.name,
          duration_minutes: slotDuration,
        });
      }

      currentSlot = nextSlot;
      if (!isBefore(currentSlot, endTime)) break;
    }
  }

  return availableSlots;
}

export async function createAppointment({
  clinicId,
  doctorId,
  patientName,
  patientPhone,
  date,
  time,
  durationMinutes = 30,
}: {
  clinicId: string;
  doctorId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  durationMinutes?: number;
}) {
  const supabase = await createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      clinic_id: clinicId,
      doctor_id: doctorId,
      patient_name: patientName,
      patient_phone: patientPhone,
      appointment_date: date,
      appointment_time: time,
      duration_minutes: durationMinutes,
      status: "confirmed",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
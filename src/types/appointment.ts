export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "rescheduled"
  | "completed"
  | "no_show";

export type Appointment = {
  id: string;
  clinic_id: string;
  patient_name: string;
  patient_phone: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Doctor = {
  id: string;
  clinic_id: string;
  name: string;
  specialization: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
};

export type TimeSlot = {
  time: string;
  available: boolean;
  doctor_id: string;
};
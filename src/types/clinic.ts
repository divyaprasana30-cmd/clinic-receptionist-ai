export type Clinic = {
  id: string;
  name: string;
  slug: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string | null;
  timezone: string;
  is_active: boolean;
  plan: "starter" | "growth" | "enterprise";
  created_at: string;
};

export type ClinicUser = {
  id: string;
  clinic_id: string;
  user_id: string;
  role: "admin" | "receptionist" | "doctor";
  created_at: string;
};
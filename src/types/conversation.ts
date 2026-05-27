export type ConversationState =
  | "new"
  | "awaiting_intent"
  | "awaiting_doctor"
  | "awaiting_date"
  | "awaiting_slot"
  | "awaiting_confirmation"
  | "confirmed"
  | "cancelled"
  | "human_handoff"
  | "completed";

export type MessageIntent =
  | "book_appointment"
  | "cancel_appointment"
  | "reschedule_appointment"
  | "check_appointment"
  | "faq"
  | "human_support"
  | "unknown";

export type ConversationSession = {
  clinic_id: string;
  patient_phone: string;
  patient_name: string | null;
  state: ConversationState;
  intent: MessageIntent | null;
  doctor_id: string | null;
  selected_date: string | null;
  selected_time: string | null;
  appointment_id: string | null;
  message_count: number;
  last_message_at: string;
};

export type Message = {
  id: string;
  clinic_id: string;
  conversation_id: string;
  direction: "inbound" | "outbound";
  content: string;
  whatsapp_message_id: string | null;
  created_at: string;
};
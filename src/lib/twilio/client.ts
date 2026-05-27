import twilio from "twilio";

export const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendWhatsAppMessage(to: string, body: string) {
  const cleaned = to.replace(/\s+/g, "").replace("whatsapp:", "").replace(/^\+/, "");
  const toNumber = `whatsapp:+${cleaned}`;
  return twilioClient.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER!,
    to: toNumber,
    body,
  });
}

export function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, string>
) {
  return twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    signature,
    url,
    params
  );
}
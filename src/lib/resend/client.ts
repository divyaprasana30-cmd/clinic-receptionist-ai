import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendBookingConfirmation({
  to,
  patientName,
  doctorName,
  date,
  time,
  clinicName,
}: {
  to: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  clinicName: string;
}) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `Appointment Confirmed — ${clinicName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0ea5e9; padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">✅ Appointment Confirmed</h1>
        </div>
        <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
          <p style="font-size: 16px;">Hi <strong>${patientName}</strong>,</p>
          <p>Your appointment has been successfully booked!</p>
          
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b;">👨‍⚕️ Doctor</td>
                <td style="padding: 8px 0; font-weight: bold;">${doctorName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">📅 Date</td>
                <td style="padding: 8px 0; font-weight: bold;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">⏰ Time</td>
                <td style="padding: 8px 0; font-weight: bold;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">🏥 Clinic</td>
                <td style="padding: 8px 0; font-weight: bold;">${clinicName}</td>
              </tr>
            </table>
          </div>

          <p style="color: #64748b; font-size: 14px;">
            Need to reschedule or cancel? Just reply to the WhatsApp message.
          </p>
          
          <p style="color: #64748b; font-size: 12px; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            This is an automated message from ${clinicName}
          </p>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendReminderEmail({
  to,
  patientName,
  doctorName,
  date,
  time,
  clinicName,
  hoursUntil,
}: {
  to: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  clinicName: string;
  hoursUntil: number;
}) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `Reminder: Appointment in ${hoursUntil} hours — ${clinicName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f59e0b; padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">⏰ Appointment Reminder</h1>
        </div>
        <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;">
          <p style="font-size: 16px;">Hi <strong>${patientName}</strong>,</p>
          <p>This is a reminder that you have an appointment in <strong>${hoursUntil} hours</strong>.</p>
          
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b;">👨‍⚕️ Doctor</td>
                <td style="padding: 8px 0; font-weight: bold;">${doctorName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">📅 Date</td>
                <td style="padding: 8px 0; font-weight: bold;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">⏰ Time</td>
                <td style="padding: 8px 0; font-weight: bold;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">🏥 Clinic</td>
                <td style="padding: 8px 0; font-weight: bold;">${clinicName}</td>
              </tr>
            </table>
          </div>

          <p style="color: #64748b; font-size: 14px;">
            Need to reschedule? Reply to the WhatsApp message.
          </p>
        </div>
      </body>
      </html>
    `,
  });
}
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendFittingAlert(to: string, clientName: string) {
  try {
    const message = await client.messages.create({
      body: `✨ THE HOUSE OF OGUCHI: Hi ${clientName}, your gown is ready for your final fitting! Please check your portal to schedule your visit. 👗🖤`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("SMS Error:", error);
    return { success: false, error };
  }
}
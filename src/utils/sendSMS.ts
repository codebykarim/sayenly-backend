// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio"; // Or, for ESM: import twilio from "twilio";
import AppError from "../errors/AppError";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * Sends a message first via WhatsApp, then falls back to SMS if WhatsApp fails
 * or if the user doesn't have WhatsApp installed.
 *
 * @param phoneNumber The recipient's phone number
 * @param code The verification code to send
 * @returns The message object from Twilio
 */
export async function sendSMS(phoneNumber: string, code: string) {
  try {
    // First attempt to send via WhatsApp
    const whatsappMessage = await client.messages.create({
      contentVariables: `{"1":"${code}"}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_PHONE_NUMBER}`,
      contentSid: process.env.TWILIO_CONTENT_SID,
      to: `whatsapp:${phoneNumber}`,
      // Add a status callback URL if you have one set up
      // statusCallback: 'https://your-status-callback-url.com/webhook',
    });

    console.log(`WhatsApp message sent with SID: ${whatsappMessage.sid}`);

    // Check message status - note that this only gives the initial status
    // For real-time status updates, you should implement a webhook
    const messageStatus = await checkMessageStatus(whatsappMessage.sid);

    // If the message is undelivered or failed, fall back to SMS
    if (messageStatus === "undelivered" || messageStatus === "failed") {
      console.log(`WhatsApp message ${messageStatus}. Falling back to SMS...`);
      return sendSMSFallback(phoneNumber, code);
    }

    // // For demo purposes, we'll also check the message status after a short delay
    // // In production, you should use webhooks instead
    // setTimeout(async () => {
    //   const updatedStatus = await checkMessageStatus(whatsappMessage.sid);
    //   console.log(
    //     `Updated WhatsApp message status after delay: ${updatedStatus}`
    //   );

    //   if (updatedStatus === "undelivered" || updatedStatus === "failed") {
    //     console.log(
    //       `WhatsApp message ${updatedStatus} after delay. Sending SMS fallback...`
    //     );
    //     sendSMSFallback(phoneNumber, code).catch((err) =>
    //       console.error("SMS fallback after delay failed:", err)
    //     );
    //   }
    // }, 5000); // Check after 5 seconds

    return whatsappMessage;
  } catch (whatsappError) {
    // Log the WhatsApp error
    console.error("WhatsApp message failed:", whatsappError);

    // Fallback to regular SMS
    return sendSMSFallback(phoneNumber, code);
  }
}

/**
 * Checks the current status of a message
 *
 * @param messageSid The SID of the message to check
 * @returns The current status of the message
 */
async function checkMessageStatus(messageSid: string): Promise<string> {
  try {
    const message = await client.messages(messageSid).fetch();
    console.log(`Message ${messageSid} status: ${message.status}`);
    return message.status;
  } catch (error) {
    console.error(`Error checking message status: ${error}`);
    return "unknown";
  }
}

/**
 * Sends a fallback SMS message
 *
 * @param phoneNumber The recipient's phone number
 * @param code The verification code to send
 * @returns The SMS message object from Twilio
 */
async function sendSMSFallback(phoneNumber: string, code: string) {
  try {
    console.log("Sending SMS fallback...");
    const smsMessage = await client.messages.create({
      body: `Your verification code is: ${code}`,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      to: phoneNumber,
    });

    console.log("SMS fallback sent successfully:", smsMessage.body);
    return smsMessage;
  } catch (smsError) {
    console.error("SMS fallback also failed:", smsError);
    throw new AppError("Failed to send message via both WhatsApp and SMS");
  }
}

import { adminMessage } from "./firebase";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
import prisma from "../prisma";

/**
 * Send a push notification to a specific device
 * @param token FCM device token
 * @param title Notification title
 * @param body Notification body
 * @param data Additional data to send with the notification
 */
export const sendPushToDevice = async (
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  try {
    console.log("🔔 Sending push notification to device:", {
      token: token.substring(0, 20) + "...",
      title,
      body,
    });

    const message: Message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token,
    };

    const response = await adminMessage.send(message);
    console.log("✅ Successfully sent message:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending message:", error);
    throw error;
  }
};

/**
 * Send a push notification to a user via their FCM tokens
 * @param userId User ID to send the notification to
 * @param title Notification title
 * @param body Notification body
 * @param data Additional data to send with the notification
 */
export const sendPushToUser = async (
  userId: string,
  title: string,
  titleAr: string,
  body: string,
  bodyAr: string,
  data?: Record<string, string>
) => {
  try {
    console.log("🔍 Looking up user for notification:", { userId });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fcmToken: true, lang: true },
    });

    console.log("👤 User found:", {
      id: user?.id,
      hasToken: !!user?.fcmToken,
      tokenPreview: user?.fcmToken?.substring(0, 20) + "...",
      lang: user?.lang,
    });

    if (!user) {
      console.error("❌ User not found:", userId);
      throw new Error(`User with ID ${userId} not found`);
    }

    if (!user.fcmToken) {
      console.error("❌ No FCM Token for user:", userId);
      throw new Error(`No FCM Token for ${userId}`);
    }

    const isArabic = user.lang === "ar";
    const finalTitle = isArabic ? titleAr : title;
    const finalBody = isArabic ? bodyAr : body;

    console.log("🌐 Sending notification with language:", {
      isArabic,
      finalTitle,
      finalBody,
      data,
    });

    return await sendPushToDevice(user.fcmToken, finalTitle, finalBody, data);
  } catch (error) {
    console.error("❌ Error sending push to user:", error);
    throw error;
  }
};

// /**
//  * Send a push notification to multiple users
//  * @param userIds Array of user IDs to send notifications to
//  * @param title Notification title
//  * @param body Notification body
//  * @param data Additional data to send with the notification
//  */
// export const sendPushToUsers = async (
//   userIds: string[],
//   title: string,
//   body: string,
//   data?: Record<string, string>
// ) => {
//   const results = await Promise.allSettled(
//     userIds.map((userId) => sendPushToUser(userId, title, body, data))
//   );

//   return results;
// };

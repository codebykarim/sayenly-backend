import { adminMessage } from "./firebase";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token,
    };

    const response = await adminMessage.send(message);
    console.log("Successfully sent message:", response);
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
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
    // Here we would fetch the user's FCM tokens from the database
    // This is a placeholder - you'll need to adapt this to your actual user schema
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fcmToken: true, lang: true },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    if (!user.fcmToken) {
      throw new Error(`No FCM Token for ${userId}`);
    }

    const isArabic = user.lang === "ar";

    return await sendPushToDevice(
      user.fcmToken,
      isArabic ? titleAr : title,
      isArabic ? bodyAr : body,
      data
    );
  } catch (error) {
    console.error("Error sending push to user:", error);
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

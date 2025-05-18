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
  body: string,
  data?: Record<string, string>
) => {
  try {
    // Here we would fetch the user's FCM tokens from the database
    // This is a placeholder - you'll need to adapt this to your actual user schema
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, settings: true },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Check if user has FCM token in settings
    if (!user.settings || typeof user.settings !== "object") {
      console.log(`No settings or FCM token found for user ${userId}`);
      return [];
    }

    const settings = user.settings as Record<string, any>;

    // First check if we have a single fcmToken (legacy)
    if (settings.fcmToken) {
      return [await sendPushToDevice(settings.fcmToken, title, body, data)];
    }

    // If we have an array of tokens, use that
    const fcmTokens = (settings.fcmTokens as string[]) || [];

    if (fcmTokens.length === 0) {
      console.log(`No FCM tokens found for user ${userId}`);
      return [];
    }

    // Send to all user devices
    const sendPromises = fcmTokens.map((token) =>
      sendPushToDevice(token, title, body, data)
    );

    const results = await Promise.allSettled(sendPromises);

    console.log(
      `Sent push notifications to ${results.length} devices for user ${userId}`
    );

    return results;
  } catch (error) {
    console.error("Error sending push to user:", error);
    throw error;
  }
};

/**
 * Send a push notification to multiple users
 * @param userIds Array of user IDs to send notifications to
 * @param title Notification title
 * @param body Notification body
 * @param data Additional data to send with the notification
 */
export const sendPushToUsers = async (
  userIds: string[],
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  const results = await Promise.allSettled(
    userIds.map((userId) => sendPushToUser(userId, title, body, data))
  );

  return results;
};

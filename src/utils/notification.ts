import { PrismaClient, NotificationType } from "@prisma/client";
import { createNotification } from "../services/notification/create";
import { sendPushToUser } from "./fcm";

const prisma = new PrismaClient();

/**
 * Send a system notification to a user
 * @param userId The user ID to send the notification to
 * @param message The message to send
 * @param route Optional route information to include in the notification
 */
export const sendSystemNotification = async (
  userId: string,
  message: string,
  messageAr: string,
  route?: any
) => {
  try {
    const notification = await createNotification({
      message,
      messageAr,
      type: NotificationType.SAYENLY,
      read: false,
      user: { connect: { id: userId } },
      ...(route && { route }),
    });

    // Send push notification if possible
    await sendPushToUser(
      userId,
      "SYANA",
      "صيانة",
      message,
      messageAr,
      route ? route : undefined
    );

    return notification;
  } catch (error) {
    console.error("Failed to send system notification:", error);
    throw error;
  }
};

/**
 * Send a reminder notification for an upcoming booking
 * @param userId The user ID to send the notification to
 * @param bookingId The booking ID related to the reminder
 * @param message The message to send
 */
export const sendBookingReminder = async (
  userId: string,
  message: string,
  messageAr: string
) => {
  try {
    const notification = await createNotification({
      message,
      messageAr,
      type: NotificationType.REMINDER,
      read: false,
      user: { connect: { id: userId } },
      route: { path: "bookings" },
    });

    // Send push notification if possible
    await sendPushToUser(
      userId,
      "SYANA Reminder",
      "تذكير من صيانة",
      message,
      messageAr,
      {
        path: "bookings",
      }
    );

    return notification;
  } catch (error) {
    console.error("Failed to send booking reminder:", error);
    throw error;
  }
};

/**
 * Send a notification when a quote is added to an order
 * @param userId The user ID to send the notification to
 * @param orderId The order ID related to the quote
 * @param message The message to send
 */
export const sendQuoteNotification = async (
  userId: string,
  message: string,
  messageAr: string
) => {
  try {
    console.log("📋 sendQuoteNotification called:", {
      userId,
      message,
      messageAr,
    });

    // Create notification with minimal database interaction
    const notification = await createNotification({
      message,
      messageAr,
      type: NotificationType.QUOTE,
      read: false,
      user: { connect: { id: userId } },
      route: { path: "orders" },
    });

    console.log("💾 Database notification created:", {
      id: notification.id,
      userId,
      message: notification.message,
    });

    console.log("📱 Attempting to send push notification...");

    sendPushToUser(userId, "New Quote", "تسعيرة جديدة", message, messageAr, {
      path: "orders",
    }).catch((error) => {
      console.error("❌ Push notification failed:", error);
    });

    console.log("✅ sendQuoteNotification completed successfully");
    return notification;
  } catch (error) {
    console.error("❌ Failed to send quote notification:", error);
    // Return null instead of throwing to prevent blocking
    return null;
  }
};

// /**
//  * Send a bulk notification to multiple users or all users
//  * @param message The message to send to all users
//  * @param type The notification type
//  * @param userIds Optional array of user IDs to send to (if not provided, sends to all users)
//  * @param route Optional route information to include in the notification
//  */
// export const sendBulkNotification = async (
//   message: string,
//   type: NotificationType = NotificationType.SAYENLY,
//   userIds?: string[],
//   route?: any
// ) => {
//   try {
//     let users;

//     if (userIds && userIds.length > 0) {
//       // Get specific users
//       users = await prisma.user.findMany({
//         where: {
//           id: {
//             in: userIds,
//           },
//         },
//         select: {
//           id: true,
//         },
//       });
//     } else {
//       // Get all users
//       users = await prisma.user.findMany({
//         select: {
//           id: true,
//         },
//       });
//     }

//     const results = {
//       total: users.length,
//       dbNotifications: 0,
//       pushNotifications: 0,
//     };

//     // Create notifications in batches
//     const notificationPromises = users.map(async (user) => {
//       try {
//         // Create database notification
//         await createNotification({
//           message,
//           type,
//           read: false,
//           user: { connect: { id: user.id } },
//           ...(route && { route }),
//         });
//         results.dbNotifications++;
//       } catch (error) {
//         console.error(
//           `Failed to create DB notification for user ${user.id}:`,
//           error
//         );
//       }
//     });

//     await Promise.all(notificationPromises);

//     // Send push notifications to all users
//     if (userIds && userIds.length > 0) {
//       try {
//         const title =
//           type === NotificationType.REMINDER
//             ? "Saynly Reminder"
//             : type === NotificationType.QUOTE
//               ? "New Quote"
//               : "Saynly";

//         const pushResults = await sendPushToUsers(
//           userIds,
//           title,
//           message,
//           route ? route : undefined
//         );

//         // Count successful push notifications
//         pushResults.forEach((result) => {
//           if (result.status === "fulfilled") {
//             results.pushNotifications++;
//           }
//         });
//       } catch (error) {
//         console.error("Failed to send push notifications:", error);
//       }
//     }

//     return results;
//   } catch (error) {
//     console.error("Failed to send bulk notifications:", error);
//     throw error;
//   }
// };

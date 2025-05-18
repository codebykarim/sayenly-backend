import { Request, Response } from "express";
import controllerReturn from "../utils/successReturn";
import { getAllNotifications } from "../services/notification/getAll";
import { getNotificationById } from "../services/notification/getById";
import { createNotification } from "../services/notification/create";
import { updateNotification } from "../services/notification/update";
import { deleteNotification } from "../services/notification/delete";
import {
  sendSystemNotification,
  sendBulkNotification,
} from "../utils/notification";
import AppError from "../errors/AppError";
import { NotificationType } from "@prisma/client";

export const getAllNotificationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const notifications = await getAllNotifications();
    return controllerReturn(notifications, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get notifications", 500);
  }
};

export const getNotificationByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const notification = await getNotificationById(id);

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return controllerReturn(notification, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get notification",
      error.statusCode || 500
    );
  }
};

export const createNotificationController = async (
  req: Request,
  res: Response
) => {
  try {
    const notificationData = req.body;

    // Set userId to logged in user if not provided
    if (!notificationData.userId && req.user?.id) {
      notificationData.user = { connect: { id: req.user.id } };
    }

    const notification = await createNotification(notificationData);
    return controllerReturn(notification, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to create notification", 500);
  }
};

export const updateNotificationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const notificationData = req.body;
    const notification = await updateNotification(id, notificationData);
    return controllerReturn(notification, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update notification", 500);
  }
};

export const deleteNotificationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const notification = await deleteNotification(id);
    return controllerReturn(
      { message: "Notification deleted successfully" },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete notification", 500);
  }
};

// New controller method to send a system notification to a user
export const sendSystemNotificationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, message, route } = req.body;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    if (!message) {
      throw new AppError("Message is required", 400);
    }

    const notification = await sendSystemNotification(userId, message, route);
    return controllerReturn(notification, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to send system notification",
      500
    );
  }
};

/**
 * Send a notification to multiple users or all users
 */
export const sendBulkNotificationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { message, type, userIds, route } = req.body;

    if (!message) {
      throw new AppError("Message is required", 400);
    }

    // Validate notification type
    let notificationType: NotificationType;
    if (
      type &&
      (type === "SAYENLY" || type === "REMINDER" || type === "QUOTE")
    ) {
      notificationType = type as NotificationType;
    } else {
      notificationType = NotificationType.SAYENLY;
    }

    // Send the bulk notification
    const results = await sendBulkNotification(
      message,
      notificationType,
      userIds,
      route
    );

    return controllerReturn(
      {
        success: true,
        message: `Successfully sent ${results.dbNotifications} database notifications and ${results.pushNotifications} push notifications`,
        results,
      },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to send bulk notifications",
      500
    );
  }
};

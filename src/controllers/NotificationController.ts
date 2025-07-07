import { Request, Response } from "express";
import controllerReturn from "../utils/successReturn";
import { getAllNotifications } from "../services/notification/getAll";
import { getNotificationById } from "../services/notification/getById";
import { createNotification } from "../services/notification/create";
import { updateNotification } from "../services/notification/update";
import { deleteNotification } from "../services/notification/delete";
import { sendSystemNotification } from "../utils/notification";
import AppError from "../errors/AppError";
import { updateAllNotifications } from "../services/notification/readAll";

export const getAllNotificationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.user;

    // Extract pagination parameters from query string
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Calculate skip value for Prisma
    const skip = (page - 1) * limit;

    const notifications = await getAllNotifications(id, { skip, take: limit });
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
    const { id } = req.query;
    const notificationData = req.body;
    const notification = await updateNotification(
      id as string,
      notificationData
    );
    return controllerReturn(notification, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update notification", 500);
  }
};

export const readOneNotificationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.query;
    const notification = await updateNotification(id as string, {
      read: true,
    });
    return controllerReturn(notification, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to read notification", 500);
  }
};

export const readAllNotificationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.user;
    const notifications = await updateAllNotifications({ read: true }, id);
    return controllerReturn(notifications, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to read all notifications",
      500
    );
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
    const { userId, message, messageAr, route } = req.body;

    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    if (!message) {
      throw new AppError("Message is required", 400);
    }

    const notification = await sendSystemNotification(
      userId,
      message,
      messageAr,
      route
    );
    return controllerReturn(notification, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to send system notification",
      500
    );
  }
};

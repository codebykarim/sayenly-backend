import { Request, Response } from "express";
import controllerReturn from "../utils/successReturn";
import { getAllUsers } from "../services/user/getAll";
import { getUserById } from "../services/user/getById";
import { updateUser } from "../services/user/update";
import { deleteUser } from "../services/user/delete";
import { updateFcmToken } from "../services/user/updateFcmToken";
import { registerDeviceToken } from "../services/user/registerDeviceToken";
import { unregisterDeviceToken } from "../services/user/unregisterDeviceToken";
import AppError from "../errors/AppError";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return controllerReturn(users, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to get users", 500);
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return controllerReturn(user, req, res);
  } catch (error: any) {
    throw new AppError(
      error.message || "Failed to get user",
      error.statusCode || 500
    );
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Only allow updating specific fields that don't affect auth
    const { name, image, settings, nationality, phoneNumber } = req.body;

    const userData = {
      ...(name && { name }),
      ...(image && { image }),
      ...(settings && { settings }),
      ...(nationality && { nationality }),
      ...(phoneNumber && { phoneNumber }),
    };

    const user = await updateUser(id, userData);
    return controllerReturn(user, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update user", 500);
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await deleteUser(id);
    return controllerReturn({ message: "User deleted successfully" }, req, res);
  } catch (error: any) {
    throw new AppError(error.message || "Failed to delete user", 500);
  }
};

/**
 * Update the FCM token for a user to enable push notifications
 * @deprecated Use registerDeviceController instead
 */
export const updateFcmTokenController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", 401);
    }

    const { fcmToken } = req.body;

    if (!fcmToken) {
      throw new AppError("FCM token is required", 400);
    }

    const user = await updateFcmToken(req.user.id, fcmToken);
    return controllerReturn(
      { message: "FCM token updated successfully" },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(error.message || "Failed to update FCM token", 500);
  }
};

/**
 * Register a device for push notifications
 */
export const registerDeviceController = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", 401);
    }

    const { deviceToken, deviceInfo } = req.body;

    if (!deviceToken) {
      throw new AppError("Device token is required", 400);
    }

    const user = await registerDeviceToken(
      req.user.id,
      deviceToken,
      deviceInfo
    );

    return controllerReturn(
      {
        message: "Device registered successfully",
        deviceCount: ((user.settings as any)?.fcmTokens || []).length,
      },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(error.message || "Failed to register device", 500);
  }
};

/**
 * Unregister a device to stop push notifications
 */
export const unregisterDeviceController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", 401);
    }

    const { deviceToken } = req.body;

    if (!deviceToken) {
      throw new AppError("Device token is required", 400);
    }

    const user = await unregisterDeviceToken(req.user.id, deviceToken);

    if (!user) {
      return controllerReturn(
        { message: "No device found to unregister" },
        req,
        res
      );
    }

    return controllerReturn(
      {
        message: "Device unregistered successfully",
        deviceCount: ((user.settings as any)?.fcmTokens || []).length,
      },
      req,
      res
    );
  } catch (error: any) {
    throw new AppError(error.message || "Failed to unregister device", 500);
  }
};

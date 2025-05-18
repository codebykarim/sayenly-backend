import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Update the FCM token for a user to enable push notifications
 * @param userId The user ID to update the FCM token for
 * @param fcmToken The FCM token to store
 */
export const updateFcmToken = async (userId: string, fcmToken: string) => {
  // Get the current user settings
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });

  // Prepare the updated settings object
  const currentSettings = (user?.settings as Record<string, any>) || {};
  const updatedSettings = {
    ...currentSettings,
    fcmToken,
  };

  // Update the user record with the new settings
  return await prisma.user.update({
    where: { id: userId },
    data: {
      settings: updatedSettings,
    },
  });
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Unregister a device token for a user when they log out from a device
 * @param userId The user ID to unregister the device token for
 * @param deviceToken The FCM device token to remove
 */
export const unregisterDeviceToken = async (
  userId: string,
  deviceToken: string
) => {
  // Get the current user settings
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });

  // If no settings or FCM tokens, nothing to do
  if (!user?.settings) {
    return null;
  }

  // Prepare the updated settings object
  const currentSettings = user.settings as Record<string, any>;

  // If no FCM tokens array, nothing to do
  if (!currentSettings.fcmTokens || !Array.isArray(currentSettings.fcmTokens)) {
    return null;
  }

  // Filter out the token to unregister
  const updatedTokens = currentSettings.fcmTokens.filter(
    (entry: any) => entry.token !== deviceToken
  );

  // Update the tokens list
  currentSettings.fcmTokens = updatedTokens;

  // Update the single token if it was the same as the one we're removing
  if (currentSettings.fcmToken === deviceToken) {
    // If we have any tokens left, use the most recent one
    if (updatedTokens.length > 0) {
      currentSettings.fcmToken = updatedTokens[updatedTokens.length - 1].token;
    } else {
      // Otherwise, remove the token
      delete currentSettings.fcmToken;
    }
  }

  // Update the user record with the new settings
  return await prisma.user.update({
    where: { id: userId },
    data: {
      settings: currentSettings,
    },
  });
};

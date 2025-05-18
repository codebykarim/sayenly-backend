import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Register a device token for a user to enable push notifications on multiple devices
 * @param userId The user ID to register the device token for
 * @param deviceToken The FCM device token to store
 * @param deviceInfo Optional device information (platform, model, etc.)
 */
export const registerDeviceToken = async (
  userId: string,
  deviceToken: string,
  deviceInfo?: Record<string, any>
) => {
  // Get the current user settings
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });

  // Prepare the updated settings object
  const currentSettings = (user?.settings as Record<string, any>) || {};

  // Create or update fcmTokens array if it doesn't exist
  if (!currentSettings.fcmTokens || !Array.isArray(currentSettings.fcmTokens)) {
    currentSettings.fcmTokens = [];
  }

  // Store device information along with token
  const tokenEntry = {
    token: deviceToken,
    ...(deviceInfo && { deviceInfo }),
    lastUpdated: new Date().toISOString(),
  };

  // Check if token is already registered to avoid duplicates
  const existingTokenIndex = currentSettings.fcmTokens.findIndex(
    (entry: any) => entry.token === deviceToken
  );

  if (existingTokenIndex >= 0) {
    // Update existing token entry
    currentSettings.fcmTokens[existingTokenIndex] = tokenEntry;
  } else {
    // Add new token
    currentSettings.fcmTokens.push(tokenEntry);
  }

  // For backward compatibility, also store the last token as fcmToken
  currentSettings.fcmToken = deviceToken;

  // Update the user record with the new settings
  return await prisma.user.update({
    where: { id: userId },
    data: {
      settings: currentSettings,
    },
  });
};

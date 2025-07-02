import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const updateAllNotifications = async (
  notificationData: Prisma.NotificationsUpdateInput
) => {
  return await prisma.notifications.updateMany({
    where: { read: false },
    data: notificationData,
  });
};

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const updateNotification = async (
  id: string,
  notificationData: Prisma.NotificationsUpdateInput
) => {
  return await prisma.notifications.update({
    where: { id },
    data: notificationData,
    include: {
      user: true,
    },
  });
};

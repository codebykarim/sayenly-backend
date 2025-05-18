import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createNotification = async (
  notificationData: Prisma.NotificationsCreateInput
) => {
  return await prisma.notifications.create({
    data: notificationData,
    include: {
      user: true,
    },
  });
};

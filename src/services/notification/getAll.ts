import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllNotifications = async (userId: string) => {
  return await prisma.notifications.findMany({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  });
};

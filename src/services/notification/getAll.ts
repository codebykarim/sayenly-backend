import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllNotifications = async () => {
  return await prisma.notifications.findMany({
    include: {
      user: true,
    },
  });
};

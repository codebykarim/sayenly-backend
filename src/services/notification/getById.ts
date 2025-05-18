import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNotificationById = async (id: string) => {
  return await prisma.notifications.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
};

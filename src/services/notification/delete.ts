import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteNotification = async (id: string) => {
  return await prisma.notifications.delete({
    where: { id },
  });
};

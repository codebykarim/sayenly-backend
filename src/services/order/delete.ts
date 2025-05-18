import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteOrder = async (id: string) => {
  return await prisma.orders.delete({
    where: { id },
  });
};

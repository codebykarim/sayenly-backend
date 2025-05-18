import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrderById = async (id: string) => {
  return await prisma.orders.findUnique({
    where: { id },
    include: {
      client: true,
      services: true,
      areas: true,
      company: true,
    },
  });
};

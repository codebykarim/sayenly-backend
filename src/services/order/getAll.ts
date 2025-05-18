import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllOrders = async () => {
  return await prisma.orders.findMany({
    include: {
      client: true,
      services: true,
      areas: true,
      company: true,
    },
  });
};

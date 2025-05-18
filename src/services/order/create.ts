import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = async (orderData: Prisma.OrdersCreateInput) => {
  return await prisma.orders.create({
    data: orderData,
    include: {
      client: true,
      services: true,
      areas: true,
      company: true,
    },
  });
};

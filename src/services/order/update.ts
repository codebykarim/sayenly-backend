import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const updateOrder = async (
  id: string,
  orderData: Prisma.OrdersUpdateInput
) => {
  return await prisma.orders.update({
    where: { id },
    data: orderData,
    include: {
      client: true,
      services: true,
      areas: true,
      company: true,
    },
  });
};

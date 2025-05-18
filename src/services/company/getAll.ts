import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCompanies = async () => {
  return await prisma.company.findMany({
    include: {
      services: true,
      pastBookings: true,
      orders: true,
    },
  });
};

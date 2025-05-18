import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCompanyById = async (id: string) => {
  return await prisma.company.findUnique({
    where: { id },
    include: {
      services: true,
      pastBookings: true,
      orders: true,
    },
  });
};

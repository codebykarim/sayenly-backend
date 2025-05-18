import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createCompany = async (companyData: Prisma.CompanyCreateInput) => {
  return await prisma.company.create({
    data: companyData,
    include: {
      services: true,
      pastBookings: true,
      orders: true,
    },
  });
};

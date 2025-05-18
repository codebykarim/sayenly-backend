import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const updateCompany = async (
  id: string,
  companyData: Prisma.CompanyUpdateInput
) => {
  return await prisma.company.update({
    where: { id },
    data: companyData,
    include: {
      services: true,
      pastBookings: true,
      orders: true,
    },
  });
};

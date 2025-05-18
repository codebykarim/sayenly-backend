import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const updateArea = async (
  id: string,
  areaData: Prisma.AreasUpdateInput
) => {
  return await prisma.areas.update({
    where: { id },
    data: areaData,
    include: {
      Projects: true,
    },
  });
};

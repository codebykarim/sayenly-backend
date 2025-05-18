import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const updateUser = async (
  id: string,
  userData: Prisma.UserUpdateInput
) => {
  return await prisma.user.update({
    where: { id },
    data: userData,
  });
};

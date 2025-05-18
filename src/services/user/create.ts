import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (userData: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data: userData,
  });
};

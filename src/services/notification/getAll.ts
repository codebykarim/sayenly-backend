import { PrismaClient } from "@prisma/client";
import AppError from "../../errors/AppError";

const prisma = new PrismaClient();

interface PaginationParams {
  skip?: number;
  take?: number;
}

export const getAllNotifications = async (
  userId: string,
  pagination?: PaginationParams
) => {
  const where = {
    userId,
  };

  const orderBy = {
    createdAt: "desc" as const,
  };

  // Get total count for pagination metadata
  const total = await prisma.notifications
    .count({
      where,
    })
    .catch((error) => {
      console.error("Error getting total notifications:", error);
      throw new AppError("Failed to get total notifications", 500);
    });

  console.log(total);

  // Get paginated results
  const notifications = await prisma.notifications
    .findMany({
      where,
      orderBy,
      ...(pagination?.skip !== undefined && { skip: pagination.skip }),
      ...(pagination?.take !== undefined && { take: pagination.take }),
    })
    .catch((error) => {
      console.error("Error getting notifications:", error);
      throw new AppError("Failed to get notifications", 500);
    });

  return {
    notifications,
    pagination: {
      total,
      page:
        pagination?.skip !== undefined && pagination?.take !== undefined
          ? Math.floor(pagination.skip / pagination.take) + 1
          : 1,
      limit: pagination?.take || total,
      totalPages: pagination?.take ? Math.ceil(total / pagination.take) : 1,
    },
  };
};

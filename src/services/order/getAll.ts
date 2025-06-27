import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PaginationParams {
  skip?: number;
  take?: number;
}

export const getAllOrders = async (
  clientId: string,
  pagination?: PaginationParams
) => {
  const where = {
    client: {
      id: clientId,
    },
    status: {
      in: ["WAITING_QUOTE", "WAITING_APPROVAL", "CANCELLED", "REJECTED"],
    },
  };

  const include = {
    client: true,
    services: true,
    areas: true,
    company: true,
  };

  const orderBy = {
    createdAt: "desc" as const,
  };

  // Get total count for pagination metadata
  const total = await prisma.orders.count({
    where,
  });

  // Get paginated results
  const orders = await prisma.orders.findMany({
    include,
    where,
    orderBy,
    ...(pagination?.skip !== undefined && { skip: pagination.skip }),
    ...(pagination?.take !== undefined && { take: pagination.take }),
  });

  return {
    orders,
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

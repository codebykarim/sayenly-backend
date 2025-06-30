import { PrismaClient, OrderStatus } from "@prisma/client";
import prisma from "../../prisma";

interface PaginationParams {
  skip?: number;
  take?: number;
}

export const getAllOrders = async (
  clientId: string | null,
  pagination?: PaginationParams,
  isDashboard?: boolean
) => {
  const where = {
    ...(clientId &&
      !isDashboard && {
        client: {
          id: clientId,
        },
      }),
    status: {
      in: [
        OrderStatus.WAITING_QUOTE,
        OrderStatus.WAITING_APPROVAL,
        OrderStatus.CANCELLED,
        OrderStatus.REJECTED,
        ...(isDashboard ? [OrderStatus.APPROVED] : []),
      ],
    },
  };

  const include = {
    client: true,
    services: true,
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

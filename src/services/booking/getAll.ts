import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface PaginationParams {
  skip?: number;
  take?: number;
}
export const getAllBookings = async (
  clientId: string | null,
  pagination?: PaginationParams
) => {
  const where = {
    ...(clientId && {
      client: {
        id: clientId,
      },
    }),
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
  const total = await prisma.bookings.count({
    where,
  });

  // Get paginated results
  const bookings = await prisma.bookings.findMany({
    include,
    where,
    orderBy,
    ...(pagination?.skip !== undefined && { skip: pagination.skip }),
    ...(pagination?.take !== undefined && { take: pagination.take }),
  });

  return {
    bookings,
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

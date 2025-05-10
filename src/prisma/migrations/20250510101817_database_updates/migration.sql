-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('WAITING_QUOTE', 'WAITING_APPROVAL', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SAYENLY', 'REMINDER', 'QUOTE');

-- CreateTable
CREATE TABLE "Projects" (
    "id" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "address" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "inApp" BOOLEAN NOT NULL DEFAULT false,
    "htmlContent" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pastJobs" INTEGER NOT NULL,
    "serviceCardImage" TEXT,
    "inApp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Areas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "areaImage" TEXT,
    "inApp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "inApp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "phoneNumbers" TEXT[],
    "emailAddresses" TEXT[],
    "addresses" TEXT[],
    "totalEarnings" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookings" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "issueDescription" TEXT NOT NULL,
    "attachments" TEXT[],
    "address" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "bookingPrice" DOUBLE PRECISION NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'UPCOMING',
    "notes" JSONB,
    "cancellationReason" TEXT,
    "reviewId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "issueDescription" TEXT NOT NULL,
    "attachments" TEXT[],
    "address" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "quote" DOUBLE PRECISION,
    "status" "OrderStatus" NOT NULL DEFAULT 'WAITING_QUOTE',
    "boq" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "type" "NotificationType" NOT NULL,
    "route" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectsToServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectsToServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AreasToProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AreasToProjects_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AreasToBookings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AreasToBookings_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AreasToOrders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AreasToOrders_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CompanyToServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompanyToServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BookingsToServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookingsToServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrdersToServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrdersToServices_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_id_key" ON "Projects"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Services_id_key" ON "Services"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Areas_id_key" ON "Areas"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Faq_id_key" ON "Faq"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Company_id_key" ON "Company"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Bookings_id_key" ON "Bookings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_id_key" ON "Orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_id_key" ON "Notifications"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_id_key" ON "Reviews"("id");

-- CreateIndex
CREATE INDEX "_ProjectsToServices_B_index" ON "_ProjectsToServices"("B");

-- CreateIndex
CREATE INDEX "_AreasToProjects_B_index" ON "_AreasToProjects"("B");

-- CreateIndex
CREATE INDEX "_AreasToBookings_B_index" ON "_AreasToBookings"("B");

-- CreateIndex
CREATE INDEX "_AreasToOrders_B_index" ON "_AreasToOrders"("B");

-- CreateIndex
CREATE INDEX "_CompanyToServices_B_index" ON "_CompanyToServices"("B");

-- CreateIndex
CREATE INDEX "_BookingsToServices_B_index" ON "_BookingsToServices"("B");

-- CreateIndex
CREATE INDEX "_OrdersToServices_B_index" ON "_OrdersToServices"("B");

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectsToServices" ADD CONSTRAINT "_ProjectsToServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectsToServices" ADD CONSTRAINT "_ProjectsToServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreasToProjects" ADD CONSTRAINT "_AreasToProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreasToProjects" ADD CONSTRAINT "_AreasToProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreasToBookings" ADD CONSTRAINT "_AreasToBookings_A_fkey" FOREIGN KEY ("A") REFERENCES "Areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreasToBookings" ADD CONSTRAINT "_AreasToBookings_B_fkey" FOREIGN KEY ("B") REFERENCES "Bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreasToOrders" ADD CONSTRAINT "_AreasToOrders_A_fkey" FOREIGN KEY ("A") REFERENCES "Areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreasToOrders" ADD CONSTRAINT "_AreasToOrders_B_fkey" FOREIGN KEY ("B") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToServices" ADD CONSTRAINT "_CompanyToServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToServices" ADD CONSTRAINT "_CompanyToServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingsToServices" ADD CONSTRAINT "_BookingsToServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingsToServices" ADD CONSTRAINT "_BookingsToServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdersToServices" ADD CONSTRAINT "_OrdersToServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdersToServices" ADD CONSTRAINT "_OrdersToServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

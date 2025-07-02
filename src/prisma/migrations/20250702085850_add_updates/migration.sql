/*
  Warnings:

  - You are about to drop the `Areas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AreasToBookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AreasToOrders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AreasToProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AreasToBookings" DROP CONSTRAINT "_AreasToBookings_A_fkey";

-- DropForeignKey
ALTER TABLE "_AreasToBookings" DROP CONSTRAINT "_AreasToBookings_B_fkey";

-- DropForeignKey
ALTER TABLE "_AreasToOrders" DROP CONSTRAINT "_AreasToOrders_A_fkey";

-- DropForeignKey
ALTER TABLE "_AreasToOrders" DROP CONSTRAINT "_AreasToOrders_B_fkey";

-- DropForeignKey
ALTER TABLE "_AreasToProjects" DROP CONSTRAINT "_AreasToProjects_A_fkey";

-- DropForeignKey
ALTER TABLE "_AreasToProjects" DROP CONSTRAINT "_AreasToProjects_B_fkey";

-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "areas" JSONB;

-- AlterTable
ALTER TABLE "Notifications" ADD COLUMN     "messageAr" TEXT;

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "areas" JSONB;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "fcmToken" TEXT,
ADD COLUMN     "lang" TEXT;

-- DropTable
DROP TABLE "Areas";

-- DropTable
DROP TABLE "_AreasToBookings";

-- DropTable
DROP TABLE "_AreasToOrders";

-- DropTable
DROP TABLE "_AreasToProjects";

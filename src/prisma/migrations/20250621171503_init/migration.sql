-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('NEW', 'EXISTING');

-- AlterTable
ALTER TABLE "Areas" ADD COLUMN     "nameAr" TEXT;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "nameAr" TEXT;

-- AlterTable
ALTER TABLE "Faq" ADD COLUMN     "answerAr" TEXT,
ADD COLUMN     "questionAr" TEXT;

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "type" "OrderType" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "reviewAr" TEXT;

-- AlterTable
ALTER TABLE "Services" ADD COLUMN     "nameAr" TEXT;

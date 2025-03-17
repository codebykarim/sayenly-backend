-- CreateEnum
CREATE TYPE "Nationality" AS ENUM ('EMIRATI', 'OTHER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "nationality" "Nationality" DEFAULT 'OTHER',
ADD COLUMN     "settings" JSONB;

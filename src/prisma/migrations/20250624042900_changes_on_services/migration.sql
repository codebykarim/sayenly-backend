/*
  Warnings:

  - You are about to drop the column `reviewAr` on the `Reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "reviewAr";

-- AlterTable
ALTER TABLE "Services" ADD COLUMN     "descriptionAr" TEXT;

/*
  Warnings:

  - You are about to drop the column `fecha` on the `Error` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Error" DROP COLUMN "fecha",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

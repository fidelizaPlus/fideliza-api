/*
  Warnings:

  - The `status` column on the `campaigns` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'FINISHED', 'CANCELLED');

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';

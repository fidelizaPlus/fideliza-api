/*
  Warnings:

  - You are about to drop the column `userId` on the `campaigns` table. All the data in the column will be lost.
  - Added the required column `managerId` to the `campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_userId_fkey";

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "managerId" UUID NOT NULL,
ALTER COLUMN "end_date" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

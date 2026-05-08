/*
  Warnings:

  - You are about to drop the column `endDate` on the `event` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event" DROP COLUMN "endDate",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL;

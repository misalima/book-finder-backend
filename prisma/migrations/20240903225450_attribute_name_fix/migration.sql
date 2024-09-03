/*
  Warnings:

  - You are about to drop the column `avarage_rating` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "avarage_rating",
ADD COLUMN     "average_rating" DOUBLE PRECISION NOT NULL DEFAULT 0;

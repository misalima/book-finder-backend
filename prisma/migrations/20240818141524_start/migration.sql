/*
  Warnings:

  - The primary key for the `BookListStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "BookListStatus" DROP CONSTRAINT "BookListStatus_pkey",
ADD CONSTRAINT "BookListStatus_pkey" PRIMARY KEY ("bookId", "listId");

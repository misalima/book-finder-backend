/*
  Warnings:

  - The `type` column on the `Status` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `listId` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Status" ADD COLUMN     "listId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

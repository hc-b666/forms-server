/*
  Warnings:

  - You are about to drop the column `name` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tagName]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tagName` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "name",
ADD COLUMN     "tagName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tagName_key" ON "Tag"("tagName");

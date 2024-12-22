/*
  Warnings:

  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `filledBy` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Question` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionText` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_filledBy_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "userId",
ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "filledBy",
ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "question",
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "questionText" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

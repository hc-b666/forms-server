/*
  Warnings:

  - A unique constraint covering the columns `[userId,templateId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_templateId_key" ON "Like"("userId", "templateId");

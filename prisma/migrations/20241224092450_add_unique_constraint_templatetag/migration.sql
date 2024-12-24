/*
  Warnings:

  - A unique constraint covering the columns `[tagId,templateId]` on the table `TemplateTag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TemplateTag_tagId_templateId_key" ON "TemplateTag"("tagId", "templateId");

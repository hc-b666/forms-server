-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_optionId_fkey";

-- AlterTable
ALTER TABLE "Response" ALTER COLUMN "answer" DROP NOT NULL,
ALTER COLUMN "optionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "QuestionOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

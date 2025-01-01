import z from 'zod';
import { QuestionType } from '@prisma/client';

export const createQuestionSchema = z.object({
  questionText: z.string().min(1).max(255),
  type: z.nativeEnum(QuestionType, {
    errorMap: () => ({
      message: 'Invalid question type',
    }),
  }),
  options: z.array(z.string()).default([]),
  order: z.number().int().positive(),
});

export type CreateQuestionDto = z.infer<typeof createQuestionSchema>;

import { QuestionType } from '@prisma/client';
import z from 'zod';

export const updateResponseSchema = z.object({
  questionId: z.number(),
  responseId: z.number(),
  questionType: z.nativeEnum(QuestionType, {
    message: 'Invalid question type',
  }),
  answer: z.string().nullable(),
  optionId: z.number().nullable().optional(),
  optionIds: z.array(z.number()).nullable().optional(),
});

export type UpdateResponseDto = z.infer<typeof updateResponseSchema>;

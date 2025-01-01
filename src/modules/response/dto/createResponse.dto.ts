import z from 'zod';

export const createResponseSchema = z.object({
  questionId: z.number(),
  answer: z.union([z.string(), z.number(), z.array(z.number())]), 
});

export type CreateResponseDto = z.infer<typeof createResponseSchema>;

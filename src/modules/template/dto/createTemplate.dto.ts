import z from 'zod';
import { TemplateTopic } from '@prisma/client';
import { createQuestionSchema } from '../../question';

export const createTemplateSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  topic: z.nativeEnum(TemplateTopic, {
    errorMap: () => ({
      message: 'Invalid template topic',
    }),
  }),
  type: z.enum(['public', 'private']),
  tags: z.array(z.string()).min(1),
  questions: z.array(createQuestionSchema).min(1),
  users: z.array(z.number()).default([]),
});

export type CreateTemplateDto = z.infer<typeof createTemplateSchema>;

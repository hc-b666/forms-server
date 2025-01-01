import { TemplateTopic } from '@prisma/client';
import z from 'zod';

export const updateDetailsSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
  topic: z.nativeEnum(TemplateTopic, {
    errorMap: () => ({
      message: 'Invalid template topic',
    }),
  }),
  tags: z.array(z.string()).min(1),
  users: z.array(z.number()).default([]),
});

export type UpdateDetailsDto = z.infer<typeof updateDetailsSchema>;

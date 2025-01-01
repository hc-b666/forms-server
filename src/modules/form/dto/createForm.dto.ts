import z from 'zod';
import { createResponseSchema } from '../../response';

export const createFormSchema = z.object({
  responses: z.array(createResponseSchema).nonempty(),
});

export type CreateFormDto = z.infer<typeof createFormSchema>;

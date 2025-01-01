import z from 'zod';

export const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type LoginDto = z.infer<typeof loginSchema>;

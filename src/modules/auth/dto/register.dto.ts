import z from 'zod';

export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string().min(3).max(16),
  email: z.string().email(),
  password: z.string().min(6).max(16),
});

export type RegisterDto = z.infer<typeof registerSchema>; 

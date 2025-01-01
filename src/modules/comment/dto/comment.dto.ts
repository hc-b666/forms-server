import z from 'zod';

export const commentSchema = z.object({
  content: z.string().min(1).max(255),
});

export type CommentDto = z.infer<typeof commentSchema>;

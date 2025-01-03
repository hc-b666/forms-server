import { Server, Socket } from 'socket.io';
import { CommentService, commentSchema } from '../../modules/comment';
import { handleSocketError } from '../../utils/errors';

export const setupCommentHandlers = (io: Server, socket: Socket) => {
  socket.on('joinTemplate', (templateId: number) => {
    socket.join(`template-${templateId}`);
  });

  socket.on('newComment', async (data: { templateId: number, userId: number, content: string }) => {
    try {
      const validatedData = await validateCommentData(data);
      if (!validatedData) return;

      const comment = await createAndEmitComment(io, validatedData);
      if (!comment) {
        handleSocketError(socket, 'Failed to create comment');
      }
    } catch (err) {
      handleSocketError(socket, 'Failed to create comment');
    }
  });
};

const validateCommentData = async (data: { templateId: number, userId: number, content: string }) => {
  if (!data.userId || typeof data.userId !== 'number') return null;
  if (!data.templateId || typeof data.templateId !== 'number') return null;

  const result = commentSchema.safeParse({ content: data.content });
  if (!result.success) return null;

  return {
    templateId: data.templateId,
    userId: data.userId,
    content: result.data.content
  };
};

const createAndEmitComment = async (io: Server, data: { templateId: number, userId: number, content: string }) => {
  const commentService = CommentService.getInstance();
  const res = await commentService.create(data.templateId, data.userId, data.content);
  
  const comment = {
    id: res.id,
    content: res.content,
    createdAt: res.createdAt,
    templateId: res.templateId,
    author: {
      id: res.author.id,
      email: res.author.email,
    },
  };

  io.to(`template-${data.templateId}`).emit('commentAdded', comment);
  return comment;
};

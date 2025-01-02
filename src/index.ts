import express from 'express';
import { Server } from 'socket.io';
import { createServer, METHODS } from 'http';
import cors from 'cors';

import router from './router';
import { endpointNotFound, errorMiddleware } from './utils/errors';
import { CommentService, commentSchema } from './modules/comment';

const corsConfig = {
  origin: ['http://localhost:8080', 'https://customizable-forms-client.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST'],
};

const app = express();

app.use(express.json());

app.use(cors(corsConfig));

app.use('/api/v1', router);

app.use(endpointNotFound);
app.use(errorMiddleware);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: corsConfig,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

io.on('connection', (socket) => {

  socket.on('joinTemplate', (templateId: number) => {
    socket.join(`template-${templateId}`);
  });

  socket.on('newComment', async (data: { templateId: number, userId: number, content: string }) => {
    try {
      if (!data.userId || typeof data.userId !== 'number') {
        return;
      }

      if (!data.templateId || typeof data.templateId !== 'number') {
        return;
      }

      const result = commentSchema.safeParse({ content: data.content });
      if (!result.success) {
        return;
      }

      const commentService = CommentService.getInstance();

      const res = await commentService.create(data.templateId, data.userId, result.data.content);
      
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
    } catch (err) {
      socket.emit('error', 'Failed to create comment');
    }
  });

});

httpServer.listen(3000);

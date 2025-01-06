import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { setupCommentHandlers } from './handlers/comment.handler';

export const createSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      credentials: true,
      origin: 'https://customizable-forms-client.vercel.app',
      methods: ['GET', 'POST'],
    },
    path: '/socket.io/',
    addTrailingSlash: false,
    transports: ['polling'],
    allowEIO3: true,
  });

  io.on('connection', (socket: Socket) => {
    setupCommentHandlers(io, socket);
  });

  return io;
};

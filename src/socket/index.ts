import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { corsConfig } from '../config/cors';
import { setupCommentHandlers } from './handlers/comment.handler';

export const createSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: corsConfig,
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    allowEIO3: true,
  });

  io.on('connection', (socket: Socket) => {
    setupCommentHandlers(io, socket);
  });

  return io;
};

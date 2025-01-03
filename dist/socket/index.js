"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketServer = void 0;
const socket_io_1 = require("socket.io");
const cors_1 = require("../config/cors");
const comment_handler_1 = require("./handlers/comment.handler");
const createSocketServer = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: cors_1.corsConfig,
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        allowEIO3: true,
    });
    io.on('connection', (socket) => {
        (0, comment_handler_1.setupCommentHandlers)(io, socket);
    });
    return io;
};
exports.createSocketServer = createSocketServer;

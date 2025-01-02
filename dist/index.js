"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const errors_1 = require("./utils/errors");
const comment_1 = require("./modules/comment");
// const corsConfig = {
//   origin: ['http://localhost:8080', 'https://customizable-forms-client.vercel.app'],
//   credentials: true,
//   methods: ['GET', 'POST'],
// };
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/api/v1', router_1.default);
app.use(errors_1.endpointNotFound);
app.use(errors_1.errorMiddleware);
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        credentials: true,
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    allowEIO3: true,
});
io.on('connection', (socket) => {
    socket.on('joinTemplate', (templateId) => {
        socket.join(`template-${templateId}`);
    });
    socket.on('newComment', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!data.userId || typeof data.userId !== 'number') {
                return;
            }
            if (!data.templateId || typeof data.templateId !== 'number') {
                return;
            }
            const result = comment_1.commentSchema.safeParse({ content: data.content });
            if (!result.success) {
                return;
            }
            const commentService = comment_1.CommentService.getInstance();
            const res = yield commentService.create(data.templateId, data.userId, result.data.content);
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
        }
        catch (err) {
            socket.emit('error', 'Failed to create comment');
        }
    }));
});
httpServer.listen(3000, () => {
    console.log('Server running on port 3000');
});

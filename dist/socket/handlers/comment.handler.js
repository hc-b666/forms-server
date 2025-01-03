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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCommentHandlers = void 0;
const comment_1 = require("../../modules/comment");
const errors_1 = require("../../utils/errors");
const setupCommentHandlers = (io, socket) => {
    socket.on('joinTemplate', (templateId) => {
        socket.join(`template-${templateId}`);
    });
    socket.on('newComment', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validatedData = yield validateCommentData(data);
            if (!validatedData)
                return;
            const comment = yield createAndEmitComment(io, validatedData);
            if (!comment) {
                (0, errors_1.handleSocketError)(socket, 'Failed to create comment');
            }
        }
        catch (err) {
            (0, errors_1.handleSocketError)(socket, 'Failed to create comment');
        }
    }));
};
exports.setupCommentHandlers = setupCommentHandlers;
const validateCommentData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.userId || typeof data.userId !== 'number')
        return null;
    if (!data.templateId || typeof data.templateId !== 'number')
        return null;
    const result = comment_1.commentSchema.safeParse({ content: data.content });
    if (!result.success)
        return null;
    return {
        templateId: data.templateId,
        userId: data.userId,
        content: result.data.content
    };
});
const createAndEmitComment = (io, data) => __awaiter(void 0, void 0, void 0, function* () {
    const commentService = comment_1.CommentService.getInstance();
    const res = yield commentService.create(data.templateId, data.userId, data.content);
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
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplateSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
const question_1 = require("../../question");
exports.createTemplateSchema = zod_1.default.object({
    title: zod_1.default.string().min(1).max(255),
    description: zod_1.default.string().min(1).max(255),
    topic: zod_1.default.nativeEnum(client_1.TemplateTopic, {
        errorMap: () => ({
            message: 'Invalid template topic',
        }),
    }),
    type: zod_1.default.enum(['public', 'private']),
    tags: zod_1.default.array(zod_1.default.string()).min(1),
    questions: zod_1.default.array(question_1.createQuestionSchema).min(1),
    users: zod_1.default.array(zod_1.default.number()).default([]),
});

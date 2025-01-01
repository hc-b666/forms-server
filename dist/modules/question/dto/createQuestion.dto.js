"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
exports.createQuestionSchema = zod_1.default.object({
    questionText: zod_1.default.string().min(1).max(255),
    type: zod_1.default.nativeEnum(client_1.QuestionType, {
        errorMap: () => ({
            message: 'Invalid question type',
        }),
    }),
    options: zod_1.default.array(zod_1.default.string()).default([]),
    order: zod_1.default.number().int().positive(),
});

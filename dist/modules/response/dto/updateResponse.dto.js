"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateResponseSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.updateResponseSchema = zod_1.default.object({
    questionId: zod_1.default.number(),
    responseId: zod_1.default.number(),
    questionType: zod_1.default.nativeEnum(client_1.QuestionType, {
        message: 'Invalid question type',
    }),
    answer: zod_1.default.string().nullable(),
    optionId: zod_1.default.number().nullable().optional(),
    optionIds: zod_1.default.array(zod_1.default.number()).nullable().optional(),
});

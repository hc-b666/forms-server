"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDetailsSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
exports.updateDetailsSchema = zod_1.default.object({
    title: zod_1.default.string().min(1).max(255),
    description: zod_1.default.string().min(1).max(255),
    topic: zod_1.default.nativeEnum(client_1.TemplateTopic, {
        errorMap: () => ({
            message: 'Invalid template topic',
        }),
    }),
    tags: zod_1.default.array(zod_1.default.string()).min(1),
    users: zod_1.default.array(zod_1.default.number()).default([]),
});

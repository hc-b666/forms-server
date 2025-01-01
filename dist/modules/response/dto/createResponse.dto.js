"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResponseSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createResponseSchema = zod_1.default.object({
    questionId: zod_1.default.number(),
    answer: zod_1.default.union([zod_1.default.string(), zod_1.default.number(), zod_1.default.array(zod_1.default.number())]),
});

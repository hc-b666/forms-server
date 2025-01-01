"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const response_1 = require("../../response");
exports.createFormSchema = zod_1.default.object({
    responses: zod_1.default.array(response_1.createResponseSchema).nonempty(),
});

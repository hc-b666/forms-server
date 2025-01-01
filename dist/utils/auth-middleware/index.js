"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const authMiddleware_controller_1 = __importDefault(require("./authMiddleware.controller"));
exports.AuthMiddleware = authMiddleware_controller_1.default;

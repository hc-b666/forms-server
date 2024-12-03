"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSecretToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const createSecretToken = (userId, email) => {
    const token_key = process.env.TOKEN_KEY;
    if (!token_key) {
        throw new Error('TOKEN_KEY is not defined in .env file');
    }
    return jsonwebtoken_1.default.sign({ userId, email }, token_key, {
        expiresIn: 60 * 60,
    });
};
exports.createSecretToken = createSecretToken;

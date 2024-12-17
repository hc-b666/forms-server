"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
class TokenService {
    static getTokenKey() {
        const token_key = process.env.TOKEN_KEY;
        if (!token_key) {
            throw new Error('TOKEN_KEY is not defined in .env file');
        }
        return token_key;
    }
    static createAccessToken(userId, email) {
        return jsonwebtoken_1.default.sign({ userId, email }, this.getTokenKey(), { expiresIn: 60 * 60 });
    }
    static createRefreshToken(userId, email) {
        return jsonwebtoken_1.default.sign({ userId, email }, this.getTokenKey(), { expiresIn: '7d' });
    }
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.getTokenKey());
        }
        catch (err) {
            console.log(`Error at verifyToken: ${err}`);
            throw new Error('Invalid or expired token');
        }
    }
    static extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Invalid authorization header');
        }
        return authHeader.split(' ')[1];
    }
}
exports.default = TokenService;

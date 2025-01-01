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
const client_1 = require("@prisma/client");
class AuthService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthService();
        }
        return this.instance;
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findUnique({ where: { email } });
        });
    }
    findVerificationToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.verificationToken.findUnique({ where: { token } });
        });
    }
    createUser(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    username: dto.username,
                    email: dto.email,
                    passwordHash: dto.passwordHash,
                    verified: true,
                },
            });
        });
    }
    createVerificationToken(dto, passwordHash, token, expires) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.verificationToken.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    username: dto.username,
                    email: dto.email,
                    passwordHash,
                    token,
                    expires,
                },
            });
        });
    }
    deleteVerificationToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.verificationToken.delete({ where: { token } });
        });
    }
}
exports.default = AuthService;

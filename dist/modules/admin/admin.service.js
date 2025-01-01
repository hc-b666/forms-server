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
class AdminService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AdminService();
        }
        return this.instance;
    }
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    email: true,
                    isBlocked: true,
                    role: true,
                },
                where: {
                    deletedAt: null,
                },
                orderBy: {
                    id: 'asc',
                },
            });
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
        });
    }
    block(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.findUserById(userId))) {
                return false;
            }
            yield this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    isBlocked: true,
                },
            });
            return true;
        });
    }
    unblock(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.findUserById(userId))) {
                return false;
            }
            yield this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    isBlocked: false,
                },
            });
            return true;
        });
    }
    promote(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.findUserById(userId))) {
                return false;
            }
            yield this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    role: client_1.UserRole.ADMIN,
                },
            });
            return true;
        });
    }
    demote(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.findUserById(userId))) {
                return false;
            }
            yield this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    role: client_1.UserRole.USER,
                },
            });
            return true;
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.findUserById(userId))) {
                return false;
            }
            yield this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
            return true;
        });
    }
}
exports.default = AdminService;

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
class UserService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserService();
        }
        return this.instance;
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
        });
    }
    searchByEmaiL(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                },
                where: {
                    id: {
                        not: userId,
                    },
                    email: {
                        contains: query,
                    },
                    deletedAt: null,
                },
            });
        });
    }
}
exports.default = UserService;

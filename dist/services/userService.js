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
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.user.create({ data });
        });
    }
    checkUserExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({ where: { email } });
            return user ? true : false;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findUnique({ where: { email } });
        });
    }
    getUsers() {
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
                orderBy: {
                    id: 'asc',
                },
            });
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    email: true,
                },
                where: {
                    id: userId,
                },
            });
            return user ? user : null;
        });
    }
    hasUserSubmittedForm(authorId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield this.prisma.form.findFirst({
                where: {
                    authorId,
                    templateId,
                },
            });
            return form ? true : false;
        });
    }
    checkIfUserIsAuthorOFTemplate(userId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.prisma.template.findFirst({
                where: { id: templateId, createdBy: userId },
            });
            return template ? true : false;
        });
    }
    searchUserByEmail(query, userId) {
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
                },
            });
        });
    }
}
exports.default = UserService;

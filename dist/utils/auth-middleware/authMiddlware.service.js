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
class AuthMiddlewareService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthMiddlewareService();
        }
        return this.instance;
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.user.findUnique({
                where: { email },
            });
        });
    }
    isAuthorOfTemplate(userId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.prisma.template.findFirst({
                where: {
                    id: templateId,
                    createdBy: userId,
                },
            });
            return template ? true : false;
        });
    }
    isAuthorOfForm(userId, formId) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield this.prisma.form.findFirst({
                where: {
                    id: formId,
                    authorId: userId,
                },
            });
            return form ? true : false;
        });
    }
}
exports.default = AuthMiddlewareService;

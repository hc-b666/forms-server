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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const userService_1 = __importDefault(require("./userService"));
class AdminService {
    constructor() {
        this.userService = userService_1.default.getInstance();
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AdminService();
        }
        return this.instance;
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.userService.getUserById(userId))) {
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
    unblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.userService.getUserById(userId))) {
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
    promoteToAdmin(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.userService.getUserById(userId))) {
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
    demoteToUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.userService.getUserById(userId))) {
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
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.userService.getUserById(userId))) {
                return false;
            }
            yield this.prisma.user.delete({
                where: {
                    id: userId,
                },
            });
            return true;
        });
    }
}
exports.default = AdminService;

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
class LikeService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!LikeService.instance) {
            LikeService.instance = new LikeService();
        }
        return LikeService.instance;
    }
    getTemplateLikes(userId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLiked = yield this.prisma.like.findUnique({
                where: {
                    userId_templateId: {
                        userId,
                        templateId,
                    },
                },
            });
            const likeCount = yield this.prisma.like.count({
                where: {
                    templateId,
                },
            });
            return { isLiked: !!isLiked, likeCount };
        });
    }
    getLikeCount(templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.like.count({
                where: {
                    templateId,
                },
            });
        });
    }
    toggleLikeTemplate(userId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingLike = yield this.prisma.like.findUnique({
                where: {
                    userId_templateId: {
                        userId,
                        templateId,
                    },
                },
            });
            if (existingLike) {
                yield this.prisma.like.delete({
                    where: {
                        userId_templateId: {
                            userId,
                            templateId,
                        },
                    },
                });
                return false;
            }
            else {
                yield this.prisma.like.create({
                    data: {
                        templateId,
                        userId,
                    },
                });
                return true;
            }
        });
    }
}
exports.default = LikeService;

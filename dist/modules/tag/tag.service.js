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
class TagService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new TagService();
        }
        return this.instance;
    }
    findTags() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.tag.findMany({ take: 20 });
        });
    }
    findTagsByTemplateId(templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield this.prisma.templateTag.findMany({
                where: {
                    templateId,
                },
                include: {
                    tag: true,
                },
            });
            return tags.map((tag) => tag.tag);
        });
    }
    searchTags(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.tag.findMany({
                where: {
                    tagName: {
                        contains: query,
                    },
                },
                take: 10,
            });
        });
    }
    createTag(tagName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.tag.upsert({
                where: { tagName },
                update: {},
                create: { tagName },
            });
        });
    }
    createTemplateTag(templateId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.templateTag.create({
                data: {
                    templateId,
                    tagId,
                },
            });
        });
    }
    deleteTemplateTag(templateId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.templateTag.delete({
                where: {
                    tagId_templateId: {
                        tagId,
                        templateId,
                    },
                },
            });
        });
    }
}
exports.default = TagService;

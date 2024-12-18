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
const tagService_1 = __importDefault(require("./tagService"));
const questionService_1 = __importDefault(require("./questionService"));
class TemplateService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.tagService = tagService_1.default.getInstance();
        this.questionService = questionService_1.default.getInstance();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new TemplateService();
        }
        return this.instance;
    }
    getTopTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = yield this.prisma.template.findMany({
                include: {
                    _count: {
                        select: { likes: true, forms: true },
                    },
                    creator: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    forms: {
                        _count: 'desc',
                    },
                },
                take: 5,
            });
            return templates.map((template) => ({
                id: template.id,
                title: template.title,
                description: template.description,
                topic: template.topic,
                createAt: template.createdAt.toISOString(),
                email: template.creator.email,
                responses: template._count.forms,
                totalLikes: template._count.likes,
            }));
        });
    }
    getLatestTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = yield this.prisma.template.findMany({
                include: {
                    creator: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: 10,
            });
            return templates.map((template) => ({
                id: template.id,
                title: template.title,
                description: template.description,
                topic: template.topic,
                createAt: template.createdAt.toISOString(),
                email: template.creator.email,
            }));
        });
    }
    getTemplateById(templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.prisma.template.findUnique({
                where: { id: templateId },
                include: {
                    creator: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                    comments: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
            return template
                ? {
                    id: template.id,
                    title: template.title,
                    description: template.description,
                    topic: template.topic,
                    createAt: template.createdAt.toISOString(),
                    email: template.creator.email,
                    questions: template.questions.map((q) => ({
                        id: q.id,
                        question: q.question,
                        type: q.type,
                        options: q.options,
                    })),
                    tags: template.tags.map((t) => t.tag.tagName),
                    comments: template.comments.map((c) => ({
                        id: c.id,
                        content: c.content,
                        createAt: c.createdAt.toISOString(),
                        email: c.user.email,
                    })),
                }
                : null;
        });
    }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = yield this.prisma.template.findMany({
                where: { createdBy: userId },
                include: {
                    creator: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                    _count: {
                        select: {
                            forms: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return templates.map((template) => ({
                id: template.id,
                title: template.title,
                description: template.description,
                topic: template.topic,
                createAt: template.createdAt.toISOString(),
                email: template.creator.email,
                responses: template._count.forms,
                tags: template.tags.map((t) => t.tag.tagName),
            }));
        });
    }
    createTemplate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.prisma.template.create({
                data: {
                    title: data.title,
                    description: data.description,
                    topic: data.topic,
                    isPublic: data.type === 'public',
                    createdBy: data.createdBy,
                },
            });
            data.questions.forEach((q) => __awaiter(this, void 0, void 0, function* () { return this.questionService.createQuestion(q, template.id); }));
            if (data.tags && data.tags.length > 0) {
                data.tags.forEach((tagName) => __awaiter(this, void 0, void 0, function* () {
                    const tag = yield this.tagService.createTag(tagName);
                    yield this.tagService.createTemplateTag(template.id, tag.id);
                }));
            }
            return template;
        });
    }
}
exports.default = TemplateService;

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
    mapTemplateToDTO(template) {
        var _a, _b;
        return {
            id: template.id,
            title: template.title,
            description: template.description,
            topic: template.topic,
            createdAt: template.createdAt.toISOString(),
            creator: template.creator && Object.assign({}, template.creator),
            responses: (_b = (_a = template._count) === null || _a === void 0 ? void 0 : _a.forms) !== null && _b !== void 0 ? _b : 0,
        };
    }
    getTemplates() {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = yield this.prisma.template.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    topic: true,
                    createdAt: true,
                    _count: {
                        select: {
                            forms: {
                                where: {
                                    deletedAt: null,
                                    author: {
                                        deletedAt: null,
                                    },
                                },
                            },
                        },
                    },
                    creator: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                where: {
                    isPublic: true,
                    deletedAt: null,
                    creator: {
                        deletedAt: null,
                    },
                },
                orderBy: {
                    forms: {
                        _count: 'desc',
                    },
                },
            });
            return templates.map(this.mapTemplateToDTO);
        });
    }
    getTopTemplates() {
        return __awaiter(this, arguments, void 0, function* (limit = 5) {
            const templates = yield this.prisma.template.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    topic: true,
                    createdAt: true,
                    _count: {
                        select: {
                            forms: {
                                where: {
                                    deletedAt: null,
                                    author: {
                                        deletedAt: null,
                                    },
                                },
                            },
                        },
                    },
                    creator: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                where: {
                    isPublic: true,
                    deletedAt: null,
                    creator: {
                        deletedAt: null,
                    },
                },
                orderBy: {
                    forms: {
                        _count: 'desc',
                    },
                },
                take: limit,
            });
            return templates.map(this.mapTemplateToDTO);
        });
    }
    getLatestTemplates() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const templates = yield this.prisma.template.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    topic: true,
                    createdAt: true,
                    _count: {
                        select: {
                            forms: {
                                where: {
                                    deletedAt: null,
                                    author: {
                                        deletedAt: null,
                                    },
                                },
                            },
                        },
                    },
                    creator: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                where: {
                    isPublic: true,
                    deletedAt: null,
                    creator: {
                        deletedAt: null,
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit,
            });
            return templates.map(this.mapTemplateToDTO);
        });
    }
    getTemplateById(templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.prisma.template.findUnique({
                where: {
                    id: templateId,
                    creator: {
                        deletedAt: null,
                    },
                },
                include: {
                    creator: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                    questions: {
                        include: {
                            options: {
                                select: {
                                    id: true,
                                    option: true,
                                },
                            },
                        },
                        orderBy: {
                            order: 'asc',
                        },
                    },
                    tags: {
                        include: {
                            tag: true,
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
                    createdAt: template.createdAt.toISOString(),
                    creator: {
                        id: template.creator.id,
                        email: template.creator.email,
                    },
                    questions: template.questions.map((q) => ({
                        id: q.id,
                        questionText: q.questionText,
                        type: q.type,
                        options: q.options,
                        order: q.order,
                    })),
                    tags: template.tags.map((t) => t.tag.tagName),
                }
                : null;
        });
    }
    getTemplatesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = yield this.prisma.template.findMany({
                where: {
                    createdBy: userId,
                    isPublic: true,
                    deletedAt: null,
                    creator: {
                        deletedAt: null,
                    },
                },
                include: {
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                    _count: {
                        select: {
                            forms: {
                                where: {
                                    deletedAt: null,
                                },
                            },
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
                createdAt: template.createdAt.toISOString(),
                responses: template._count.forms,
                tags: template.tags.map((t) => t.tag.tagName),
            }));
        });
    }
    getPrivateTemplatesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = yield this.prisma.template.findMany({
                where: {
                    createdBy: userId,
                    isPublic: false,
                    deletedAt: null,
                    creator: {
                        deletedAt: null,
                    },
                },
                include: {
                    tags: {
                        select: {
                            tag: true,
                        },
                    },
                    _count: {
                        select: {
                            forms: {
                                where: {
                                    deletedAt: null,
                                },
                            },
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
                createdAt: template.createdAt.toISOString(),
                responses: template._count.forms,
                tags: template.tags.map((t) => t.tag.tagName),
            }));
        });
    }
    getPrivateTemplatesForAccessibleUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessibles = yield this.prisma.accessControl.findMany({
                select: {
                    template: {
                        include: {
                            tags: {
                                select: {
                                    tag: true,
                                },
                            },
                            _count: {
                                select: {
                                    forms: {
                                        where: {
                                            deletedAt: null,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                where: {
                    userId,
                    template: {
                        isPublic: false,
                        deletedAt: null,
                    },
                    user: {
                        deletedAt: null,
                    },
                },
                orderBy: {
                    template: {
                        createdAt: 'desc',
                    },
                },
            });
            return accessibles.map((accessible) => ({
                id: accessible.template.id,
                title: accessible.template.title,
                description: accessible.template.description,
                topic: accessible.template.topic,
                createdAt: accessible.template.createdAt.toISOString(),
                responses: accessible.template._count.forms,
                tags: accessible.template.tags.map((t) => t.tag.tagName),
            }));
        });
    }
    getTemplatesByTagId(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = yield this.prisma.template.findMany({
                include: {
                    tags: {
                        select: {
                            tag: true,
                        },
                    },
                    _count: {
                        select: {
                            forms: true,
                        },
                    },
                    creator: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                where: {
                    tags: {
                        some: {
                            tagId,
                        },
                    },
                    creator: {
                        deletedAt: null,
                    },
                    isPublic: true,
                    deletedAt: null,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return templates.map((t) => ({
                id: t.id,
                title: t.title,
                description: t.description,
                topic: t.topic,
                createdAt: t.createdAt.toISOString(),
                responses: t._count.forms,
                tags: t.tags.map((t) => t.tag.tagName),
                creator: {
                    id: t.creator.id,
                    email: t.creator.email,
                },
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
            if (data.type === 'private') {
                data.users.forEach((userId) => __awaiter(this, void 0, void 0, function* () {
                    return this.prisma.accessControl.create({
                        data: {
                            templateId: template.id,
                            userId,
                        },
                    });
                }));
            }
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
    searchTemplates(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = yield this.prisma.template.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    topic: true,
                    createdAt: true,
                    _count: {
                        select: {
                            forms: true,
                        },
                    },
                    creator: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                where: {
                    isPublic: true,
                    deletedAt: null,
                    creator: {
                        deletedAt: null,
                    },
                    OR: [
                        { title: { contains: query } },
                        { description: { contains: query } },
                        { questions: { some: { questionText: { contains: query } } } },
                        { tags: { some: { tag: { tagName: { contains: query } } } } },
                    ],
                },
            });
            return templates.map((template) => ({
                id: template.id,
                title: template.title,
                description: template.description,
                topic: template.topic,
                createdAt: template.createdAt.toISOString(),
                creator: Object.assign({}, template.creator),
                responses: template._count.forms,
            }));
        });
    }
    editTemplateDetails(templateId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.prisma.template.findUnique({
                where: { id: templateId },
            });
            if (!template) {
                return false;
            }
            yield this.prisma.template.update({
                where: { id: templateId },
                data: {
                    title: data.title,
                    description: data.description,
                    topic: data.topic,
                },
            });
            const tags = yield this.tagService.getTagsByTemplateId(templateId);
            const tagNames = tags.map((t) => t.tagName);
            const newTags = data.tags.filter((tag) => !tagNames.includes(tag));
            const oldTags = tags.filter((t) => !data.tags.includes(t.tagName));
            newTags.forEach((tagName) => __awaiter(this, void 0, void 0, function* () {
                const tag = yield this.tagService.createTag(tagName);
                yield this.tagService.createTemplateTag(templateId, tag.id);
            }));
            oldTags.forEach((tag) => __awaiter(this, void 0, void 0, function* () {
                yield this.tagService.deleteTemplateTag(templateId, tag.id);
            }));
            return true;
        });
    }
    deleteTemplate(templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.template.update({
                where: {
                    id: templateId,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        });
    }
}
exports.default = TemplateService;

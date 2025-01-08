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
const question_1 = require("../question");
const tag_1 = require("../tag");
class TemplateService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.questionService = question_1.QuestionService.getInstance();
        this.tagService = tag_1.TagService.getInstance();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new TemplateService();
        }
        return this.instance;
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (limit = 20) {
            const templates = yield this.prisma.template.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    topic: true,
                    createdAt: true,
                    imageId: true,
                    imageUrl: true,
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
            return templates.map((template) => ({
                id: template.id,
                title: template.title,
                description: template.description,
                topic: template.topic,
                createdAt: template.createdAt.toISOString(),
                creator: Object.assign({}, template.creator),
                responses: template._count.forms,
                imageId: template.imageId,
                imageUrl: template.imageUrl,
            }));
        });
    }
    findTop() {
        return __awaiter(this, arguments, void 0, function* (limit = 5) {
            const templates = yield this.prisma.template.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    topic: true,
                    createdAt: true,
                    imageId: true,
                    imageUrl: true,
                    creator: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
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
            return templates.map((template) => ({
                id: template.id,
                title: template.title,
                description: template.description,
                topic: template.topic,
                createdAt: template.createdAt,
                creator: Object.assign({}, template.creator),
                responses: template._count.forms,
                imageId: template.imageId,
                imageUrl: template.imageUrl,
            }));
        });
    }
    findLatest() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const templates = yield this.prisma.template.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    topic: true,
                    createdAt: true,
                    imageId: true,
                    imageUrl: true,
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
            return templates.map((template) => ({
                id: template.id,
                title: template.title,
                description: template.description,
                topic: template.topic,
                createdAt: template.createdAt.toISOString(),
                creator: Object.assign({}, template.creator),
                responses: template._count.forms,
                imageId: template.imageId,
                imageUrl: template.imageUrl,
            }));
        });
    }
    findById(templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.prisma.template.findUnique({
                where: {
                    id: templateId,
                    creator: {
                        deletedAt: null,
                    },
                },
                include: {
                    _count: {
                        select: {
                            forms: {
                                where: {
                                    deletedAt: null,
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
                    accessControls: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                },
                            },
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
                    responses: template._count.forms,
                    tags: template.tags.map((t) => t.tag),
                    accessControls: template.accessControls.map((ac) => ac.user),
                    isPublic: template.isPublic,
                    imageId: template.imageId,
                    imageUrl: template.imageUrl,
                }
                : null;
        });
    }
    findPublicTemplatesByUserId(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 5) {
            const skip = (page - 1) * limit;
            const total = yield this.prisma.template.count({
                where: {
                    createdBy: userId,
                    isPublic: true,
                    deletedAt: null,
                    creator: {
                        deletedAt: null,
                    },
                },
            });
            const templates = yield this.prisma.template.findMany({
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
                            likes: {
                                where: {
                                    user: {
                                        deletedAt: null,
                                    },
                                },
                            },
                        },
                    },
                },
                where: {
                    createdBy: userId,
                    isPublic: true,
                    deletedAt: null,
                    creator: {
                        deletedAt: null,
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            });
            return {
                templates: templates.map((template) => ({
                    id: template.id,
                    title: template.title,
                    description: template.description,
                    topic: template.topic,
                    createdAt: template.createdAt,
                    responses: template._count.forms,
                    likes: template._count.likes,
                    tags: template.tags.map((t) => t.tag),
                })),
                metadata: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                },
            };
        });
    }
    findPrivateTemplatesByUserId(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 5) {
            const skip = (page - 1) * limit;
            const total = yield this.prisma.template.count({
                where: {
                    createdBy: userId,
                    isPublic: false,
                    deletedAt: null,
                    creator: {
                        deletedAt: null,
                    },
                },
            });
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
                            likes: {
                                where: {
                                    user: {
                                        deletedAt: null,
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            });
            return {
                templates: templates.map((template) => ({
                    id: template.id,
                    title: template.title,
                    description: template.description,
                    topic: template.topic,
                    createdAt: template.createdAt,
                    responses: template._count.forms,
                    likes: template._count.likes,
                    tags: template.tags.map((t) => t.tag),
                })),
                metadata: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                },
            };
        });
    }
    findPrivateAccessibleTemplatesByUserId(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 5) {
            const skip = (page - 1) * limit;
            const total = yield this.prisma.accessControl.count({
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
            });
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
                                    likes: {
                                        where: {
                                            user: {
                                                deletedAt: null,
                                            },
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
                skip,
                take: limit,
            });
            return {
                templates: accessibles.map((accessible) => ({
                    id: accessible.template.id,
                    title: accessible.template.title,
                    description: accessible.template.description,
                    topic: accessible.template.topic,
                    createdAt: accessible.template.createdAt,
                    responses: accessible.template._count.forms,
                    likes: accessible.template._count.likes,
                    tags: accessible.template.tags.map((t) => t.tag),
                })),
                metadata: {
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                },
            };
        });
    }
    findByTagId(tagId_1) {
        return __awaiter(this, arguments, void 0, function* (tagId, limit = 20) {
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
                take: limit,
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
                imageId: t.imageId,
            }));
        });
    }
    create(userId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const template = yield this.prisma.template.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    topic: dto.topic,
                    isPublic: dto.type === 'public',
                    createdBy: userId,
                },
            });
            if (dto.type === 'private') {
                dto.users.forEach((userId) => __awaiter(this, void 0, void 0, function* () {
                    return this.prisma.accessControl.create({
                        data: {
                            templateId: template.id,
                            userId,
                        },
                    });
                }));
            }
            dto.questions.forEach((question) => __awaiter(this, void 0, void 0, function* () { return this.questionService.createQuestion(template.id, question); }));
            dto.tags.forEach((tagName) => __awaiter(this, void 0, void 0, function* () {
                const tag = yield this.tagService.createTag(tagName);
                yield this.tagService.createTemplateTag(template.id, tag.id);
            }));
            return template.id;
        });
    }
    addImage(templateId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.template.update({
                where: {
                    id: templateId,
                },
                data: {
                    imageId,
                    imageUrl: `https://drive.google.com/uc?id=${imageId}`,
                },
            });
        });
    }
    search(query) {
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
    updateDetails(templateId, dto) {
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
                    title: dto.title,
                    description: dto.description,
                    topic: dto.topic,
                },
            });
            const tags = yield this.tagService.findTagsByTemplateId(templateId);
            const tagNames = tags.map((t) => t.tagName);
            const newTags = dto.tags.filter((tag) => !tagNames.includes(tag));
            const oldTags = tags.filter((t) => !dto.tags.includes(t.tagName));
            newTags.forEach((tagName) => __awaiter(this, void 0, void 0, function* () {
                const tag = yield this.tagService.createTag(tagName);
                yield this.tagService.createTemplateTag(templateId, tag.id);
            }));
            oldTags.forEach((tag) => __awaiter(this, void 0, void 0, function* () {
                yield this.tagService.deleteTemplateTag(templateId, tag.id);
            }));
            const accessibles = yield this.prisma.accessControl.findMany({
                where: {
                    templateId,
                },
            });
            const newUsers = dto.users.filter((userId) => !accessibles.some((a) => a.userId === userId));
            const oldUsers = accessibles.filter((a) => !dto.users.includes(a.userId));
            newUsers.forEach((userId) => __awaiter(this, void 0, void 0, function* () {
                return this.prisma.accessControl.create({
                    data: {
                        templateId,
                        userId,
                    },
                });
            }));
            oldUsers.forEach((a) => __awaiter(this, void 0, void 0, function* () {
                yield this.prisma.accessControl.delete({
                    where: {
                        id: a.id,
                    },
                });
            }));
            return true;
        });
    }
    delete(templateId) {
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

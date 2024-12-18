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
class TemplateService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
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
    getForms(templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const forms = yield this.prisma.form.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                where: { templateId },
                orderBy: {
                    filledAt: 'desc',
                },
            });
            return forms.map((f) => ({
                formId: f.id,
                filledAt: f.filledAt.toISOString(),
                email: f.user.email,
                filledBy: f.filledBy,
            }));
        });
    }
    getForm(formId) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield this.prisma.form.findUnique({
                include: {
                    responses: {
                        include: {
                            question: true,
                            option: true,
                        },
                    },
                },
                where: {
                    id: formId,
                },
            });
            const responses = new Map();
            form === null || form === void 0 ? void 0 : form.responses.forEach((r) => {
                var _a;
                if (!responses.has(r.questionId)) {
                    responses.set(r.questionId, {
                        questionId: r.questionId,
                        question: r.question.question,
                        type: r.question.type,
                        responseId: r.id,
                        answer: r.answer,
                        optionId: r.optionId,
                        option: ((_a = r.option) === null || _a === void 0 ? void 0 : _a.option) || null,
                        options: r.option ? [r.option.option] : [],
                    });
                }
                else {
                    const existing = responses.get(r.questionId);
                    if (r.option && !existing.options.includes(r.option.option)) {
                        existing.options.push(r.option.option);
                    }
                }
            });
            return Array.from(responses.values());
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
    hasUserSubmittedForm(userId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield this.prisma.form.findFirst({
                where: {
                    filledBy: userId,
                    templateId,
                },
            });
            return form ? true : false;
        });
    }
    createTemplate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const template = yield this.prisma.template.create({
                data: {
                    title: data.title,
                    description: data.description,
                    topic: data.topic,
                    isPublic: data.type === 'public',
                    createdBy: data.createdBy,
                },
            });
            for (const q of data.questions) {
                const question = yield this.prisma.question.create({
                    data: {
                        templateId: template.id,
                        question: q.question,
                        type: q.type,
                    },
                });
                if ((q.type === 'MCQ' || q.type === 'CHECKBOX') &&
                    ((_a = q.options) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    for (const option of q.options) {
                        yield this.prisma.questionOption.create({
                            data: {
                                questionId: question.id,
                                option,
                            },
                        });
                    }
                }
            }
            if (data.tags && data.tags.length > 0) {
                for (const tagName of data.tags) {
                    const tag = yield this.prisma.tag.upsert({
                        where: { tagName },
                        update: {},
                        create: { tagName },
                    });
                    yield this.prisma.templateTag.create({
                        data: {
                            templateId: template.id,
                            tagId: tag.id,
                        },
                    });
                }
            }
            return template;
        });
    }
    createForm(_a) {
        return __awaiter(this, arguments, void 0, function* ({ templateId, filledBy, responses }) {
            const form = yield this.prisma.form.create({
                data: {
                    templateId,
                    filledBy,
                },
            });
            for (const r of responses) {
                if (typeof r.answer === 'string') {
                    yield this.prisma.response.create({
                        data: {
                            formId: form.id,
                            questionId: r.questionId,
                            answer: r.answer,
                        },
                    });
                }
                else if (typeof r.answer === 'number') {
                    yield this.prisma.response.create({
                        data: {
                            formId: form.id,
                            questionId: r.questionId,
                            optionId: r.answer,
                        },
                    });
                }
                else {
                    for (const optionId of r.answer) {
                        yield this.prisma.response.create({
                            data: {
                                formId: form.id,
                                questionId: r.questionId,
                                optionId,
                            },
                        });
                    }
                }
            }
        });
    }
    createComment(templateId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.comment.create({
                data: {
                    templateId,
                    userId,
                    content,
                },
            });
        });
    }
}
exports.default = TemplateService;

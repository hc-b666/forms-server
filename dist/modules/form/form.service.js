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
const response_1 = require("../response");
class FormService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.responseService = response_1.ResponseService.getInstance();
        this.questionService = question_1.QuestionService.getInstance();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new FormService();
        }
        return this.instance;
    }
    findByTemplateId(templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.form.findMany({
                select: {
                    id: true,
                    filledAt: true,
                    author: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                where: {
                    templateId,
                    deletedAt: null,
                    author: {
                        deletedAt: null,
                    },
                },
                orderBy: {
                    filledAt: 'desc',
                },
            });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const forms = yield this.prisma.form.findMany({
                select: {
                    id: true,
                    filledAt: true,
                    template: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            topic: true,
                            tags: {
                                select: {
                                    tag: {
                                        select: {
                                            id: true,
                                            tagName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                where: {
                    authorId: userId,
                    template: {
                        deletedAt: null,
                    },
                    author: {
                        deletedAt: null,
                    },
                    deletedAt: null,
                },
                orderBy: {
                    filledAt: 'desc',
                },
            });
            return forms.map((f) => (Object.assign(Object.assign({}, f), { template: Object.assign(Object.assign({}, f.template), { tags: f.template.tags.map((t) => t.tag.tagName) }) })));
        });
    }
    findById(formId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield this.prisma.form.findFirst({
                select: {
                    id: true,
                    authorId: true,
                    filledAt: true,
                },
                where: {
                    id: formId,
                    deletedAt: null,
                    author: {
                        deletedAt: null,
                    },
                },
            });
            const questions = yield this.questionService.getQuestions(templateId);
            const responses = yield this.responseService.findByFormId(formId);
            return { form, questions, responses };
        });
    }
    hasSubmittedForm(userId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield this.prisma.form.findFirst({
                where: {
                    authorId: userId,
                    templateId,
                    deletedAt: null,
                },
            });
            return form ? true : false;
        });
    }
    create(userId, templateId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield this.prisma.form.create({
                data: {
                    authorId: userId,
                    templateId,
                },
            });
            dto.responses.forEach((response) => __awaiter(this, void 0, void 0, function* () {
                return yield this.responseService.create(form.id, response.questionId, response.answer);
            }));
        });
    }
    delete(formId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.form.update({
                where: {
                    id: formId,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        });
    }
}
exports.default = FormService;

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
const responseService_1 = __importDefault(require("./responseService"));
const questionService_1 = __importDefault(require("./questionService"));
class FormService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.responseService = responseService_1.default.getInstance();
        this.questionService = questionService_1.default.getInstance();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new FormService();
        }
        return this.instance;
    }
    getForms(templateId) {
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
                },
                orderBy: {
                    filledAt: 'desc',
                },
            });
        });
    }
    getFormsByUser(authorId) {
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
                    authorId,
                    template: {
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
    getForm(formId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield this.prisma.form.findUnique({
                select: {
                    id: true,
                    authorId: true,
                    filledAt: true,
                },
                where: {
                    id: formId,
                    deletedAt: null,
                },
            });
            if (!form) {
                return null;
            }
            const questions = yield this.questionService.getQuestions(templateId);
            const responses = yield this.responseService.getResponses(formId);
            return {
                form,
                questions,
                responses,
            };
        });
    }
    createForm(_a) {
        return __awaiter(this, arguments, void 0, function* ({ authorId, templateId, responses }) {
            const form = yield this.prisma.form.create({
                data: {
                    authorId,
                    templateId,
                },
            });
            responses.forEach((response) => __awaiter(this, void 0, void 0, function* () {
                return yield this.responseService.createResponse(form.id, response.questionId, response.answer);
            }));
        });
    }
    deleteForm(formId) {
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

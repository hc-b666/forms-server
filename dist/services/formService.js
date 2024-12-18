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
class FormService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.responseService = responseService_1.default.getInstance();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new FormService();
        }
        return this.instance;
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
    createForm(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filledBy, templateId, responses }) {
            const form = yield this.prisma.form.create({
                data: {
                    filledBy,
                    templateId,
                },
            });
            responses.forEach((response) => __awaiter(this, void 0, void 0, function* () {
                return yield this.responseService.createResponse(form.id, response.questionId, response.answer);
            }));
        });
    }
}
exports.default = FormService;

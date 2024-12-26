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
class QuestionService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new QuestionService();
        }
        return this.instance;
    }
    createQuestion(_a, templateId_1) {
        return __awaiter(this, arguments, void 0, function* ({ questionText, type, options, order }, templateId) {
            const q = yield this.prisma.question.create({
                data: {
                    templateId,
                    questionText,
                    type,
                    order,
                },
            });
            if ((type === 'MCQ' || type === 'CHECKBOX') && options.length > 0) {
                options.forEach((option) => __awaiter(this, void 0, void 0, function* () { return this.createQuestionOption(option, q.id); }));
            }
        });
    }
    createQuestionOption(option, questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.questionOption.create({
                data: {
                    questionId,
                    option,
                },
            });
        });
    }
    editQuestion(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, questionText, type, options, order }) {
            yield this.prisma.question.update({
                where: {
                    id,
                },
                data: {
                    questionText,
                    type,
                    order,
                },
            });
            if ((type === 'MCQ' || type === 'CHECKBOX') && options.length > 0) {
                options.forEach((option) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof option.id === 'string') {
                        yield this.createQuestionOption(option.option, id);
                    }
                    else {
                        yield this.prisma.questionOption.update({
                            where: {
                                id: option.id,
                            },
                            data: {
                                option: option.option,
                            },
                        });
                    }
                }));
            }
        });
    }
}
exports.default = QuestionService;

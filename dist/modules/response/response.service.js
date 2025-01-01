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
class ResponseService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ResponseService();
        }
        return this.instance;
    }
    findByFormId(formId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.response.findMany({
                where: {
                    formId,
                },
            });
        });
    }
    create(formId, questionId, answer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof answer === 'string') {
                yield this.prisma.response.create({
                    data: {
                        formId,
                        questionId,
                        answer,
                    },
                });
            }
            else if (typeof answer === 'number') {
                yield this.prisma.response.create({
                    data: {
                        formId,
                        questionId,
                        optionId: answer,
                    },
                });
            }
            else {
                answer.forEach((optionId) => __awaiter(this, void 0, void 0, function* () {
                    yield this.prisma.response.create({
                        data: {
                            formId,
                            questionId,
                            optionId,
                        },
                    });
                }));
            }
        });
    }
    update(formId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (data.questionType) {
                case 'TEXT':
                case 'PARAGRAPH': {
                    yield this.prisma.response.update({
                        where: {
                            id: data.responseId,
                        },
                        data: {
                            answer: data.answer,
                        },
                    });
                    break;
                }
                case 'MCQ': {
                    yield this.prisma.response.update({
                        where: {
                            id: data.responseId,
                        },
                        data: {
                            optionId: data.optionId,
                        },
                    });
                    break;
                }
                case 'CHECKBOX': {
                    const existingResponses = yield this.prisma.response.findMany({
                        where: {
                            formId,
                            questionId: data.questionId,
                        },
                    });
                    const newOptionIds = new Set(data.optionIds);
                    const responsesToDelete = existingResponses.filter((response) => !newOptionIds.has(response.optionId));
                    if (responsesToDelete.length > 0) {
                        yield this.prisma.response.deleteMany({
                            where: {
                                id: {
                                    in: responsesToDelete.map((response) => response.id),
                                },
                            },
                        });
                    }
                    for (const optionId of data.optionIds || []) {
                        const exists = existingResponses.find((response) => response.optionId === optionId);
                        if (!exists) {
                            yield this.prisma.response.create({
                                data: {
                                    formId,
                                    questionId: data.questionId,
                                    optionId,
                                },
                            });
                        }
                        else {
                            yield this.prisma.response.update({
                                where: {
                                    id: exists.id,
                                },
                                data: {
                                    optionId,
                                },
                            });
                        }
                    }
                    break;
                }
            }
        });
    }
}
exports.default = ResponseService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestionSchema = exports.QuestionService = void 0;
const question_service_1 = __importDefault(require("./question.service"));
exports.QuestionService = question_service_1.default;
const createQuestion_dto_1 = require("./dto/createQuestion.dto");
Object.defineProperty(exports, "createQuestionSchema", { enumerable: true, get: function () { return createQuestion_dto_1.createQuestionSchema; } });

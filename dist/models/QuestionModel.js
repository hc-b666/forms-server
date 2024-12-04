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
exports.createQuestions = exports.createQuestion = exports.QuestionType = void 0;
const mongoose_1 = require("mongoose");
var QuestionType;
(function (QuestionType) {
    QuestionType["SHORT"] = "short";
    QuestionType["PARAGRAPH"] = "paragraph";
    QuestionType["MCQ"] = "mcq";
    QuestionType["CHECKBOX"] = "checkbox";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
const QuestionSchema = new mongoose_1.Schema({
    templateId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Template', required: true }, // FK
    question: { type: String, required: true },
    type: { type: String, enum: Object.values(QuestionType), required: true },
    options: { type: [String], required: true },
});
const QuestionModel = (0, mongoose_1.model)('Question', QuestionSchema);
exports.default = QuestionModel;
const createQuestion = (_a) => __awaiter(void 0, [_a], void 0, function* ({ templateId, question, type, options }) {
    const newQ = new QuestionModel({
        templateId,
        question,
        type,
        options,
    });
    yield newQ.save();
});
exports.createQuestion = createQuestion;
const createQuestions = ({ questions, templateId }) => {
    questions.forEach((q) => (0, exports.createQuestion)(Object.assign({ templateId }, q)));
};
exports.createQuestions = createQuestions;

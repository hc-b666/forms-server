"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var QuestionType;
(function (QuestionType) {
    QuestionType["SHORT"] = "short";
    QuestionType["PARAGRAPH"] = "paragraph";
    QuestionType["MCQ"] = "mcq";
    QuestionType["CHECKBOX"] = "checkbox";
})(QuestionType || (QuestionType = {}));
const QuestionSchema = new mongoose_1.Schema({
    templateId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Template', required: true }, // FK
    question: { type: String, required: true },
    type: { type: String, enum: Object.values(QuestionType), required: true },
    options: { type: [String], required: false },
});
exports.default = (0, mongoose_1.model)('Question', QuestionSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ResponseSchema = new mongoose_1.Schema({
    formId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Form', required: true }, // FK
    questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Question', required: true }, // FK
    answer: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)('Response', ResponseSchema);

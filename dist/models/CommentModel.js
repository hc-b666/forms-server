"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }, // FK
    templateId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Template', required: true }, // FK
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)('Comment', CommentSchema);

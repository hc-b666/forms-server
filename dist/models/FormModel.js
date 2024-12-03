"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FormSchema = new mongoose_1.Schema({
    filledBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }, // FK
    templateId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Template', required: true }, // FK
    filledAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)('Form', FormSchema);

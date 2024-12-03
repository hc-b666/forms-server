"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TemplateTagSchema = new mongoose_1.Schema({
    tagId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tag', required: true }, // FK
    templateId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Template', required: true }, // FK
});
exports.default = (0, mongoose_1.model)('TemplateTag', TemplateTagSchema);

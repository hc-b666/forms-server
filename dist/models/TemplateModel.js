"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
const mongoose_1 = require("mongoose");
var Topic;
(function (Topic) {
    Topic["EDUCATION"] = "education";
    Topic["QUIZ"] = "quiz";
    Topic["OTHER"] = "other";
})(Topic || (exports.Topic = Topic = {}));
const TemplateSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }, // FK
    topic: { type: String, enum: Object.values(Topic), required: true },
    isPublic: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now() },
});
exports.default = (0, mongoose_1.model)('Template', TemplateSchema);

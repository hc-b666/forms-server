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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTemplate = void 0;
const postgresDb_1 = __importDefault(require("../models/postgresDb"));
const templateQuery_1 = require("../models/queries/templateQuery");
const questionQuery_1 = require("../models/queries/questionQuery");
const tagQuery_1 = require("../models/queries/tagQuery");
const createTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, createdBy, topic, type, questions, tags } = req.body;
        if (!title || !description || !createdBy || !topic || questions.length === 0) {
            res.status(400).json({ message: 'All inputs are required for creating the template' });
            return;
        }
        const userId = req.userId;
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        const templateRest = yield postgresDb_1.default.query(templateQuery_1.createTemplateQuery, [userId, title, description, topic, type === 'public' ? true : false]);
        const templateId = templateRest.rows[0].id;
        for (const q of questions) {
            yield postgresDb_1.default.query(questionQuery_1.createQuestionQuery, [templateId, q.question, q.type, q.options]);
        }
        for (const tag of tags) {
            let tagRes = yield postgresDb_1.default.query(tagQuery_1.findTagQuery, [tag]);
            let tagId;
            if (tagRes.rows.length === 0) {
                tagRes = yield postgresDb_1.default.query(tagQuery_1.createTagQuery, [tag]);
                tagId = tagRes.rows[0].id;
            }
            else {
                tagId = tagRes.rows[0].id;
            }
            yield postgresDb_1.default.query(tagQuery_1.createTemplateTagQuery, [templateId, tagId]);
        }
        res.status(200).json({ message: 'Successfully created template' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.createTemplate = createTemplate;

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
exports.unlikeTemplate = exports.likeTemplate = exports.getProfile = exports.getTemplateById = exports.getLatestTemplates = exports.getTopTemplates = exports.createTemplate = void 0;
const postgresDb_1 = __importDefault(require("../models/postgresDb"));
const templateQuery_1 = require("../models/queries/templateQuery");
const questionQuery_1 = require("../models/queries/questionQuery");
const tagQuery_1 = require("../models/queries/tagQuery");
const userQuery_1 = require("../models/queries/userQuery");
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
const getTopTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const templates = yield (0, templateQuery_1.getTopTemplatesQuery)(userId ? userId : null);
        res.status(200).json(templates);
    }
    catch (err) {
        console.log(`Error in getTopTemplates: ${err}`);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.getTopTemplates = getTopTemplates;
const getLatestTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templates = yield postgresDb_1.default.query(templateQuery_1.getLatestTemplatesQuery);
        res.status(200).json(templates.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.getLatestTemplates = getLatestTemplates;
const getTemplateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const template = yield postgresDb_1.default.query(templateQuery_1.getTemplateByIdQuery, [id]);
        res.status(200).json(template.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.getTemplateById = getTemplateById;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        const templates = yield (0, templateQuery_1.getProfileTemplatesQuery)(parseInt(userId));
        const user = yield (0, userQuery_1.getUserByIdQuery)(parseInt(userId));
        res.status(200).json({ templates, user });
    }
    catch (err) {
        console.log(`Error in getProfile: ${err}`);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.getProfile = getProfile;
const likeTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { templateId } = req.params;
        if (!templateId) {
            res.status(400).json({ message: 'Template ID is required' });
            return;
        }
        const userId = req.userId;
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        yield (0, templateQuery_1.likeTemplateQuery)(userId, parseInt(templateId));
        res.status(200).json({ message: 'Successfully liked template' });
    }
    catch (err) {
        console.log(`Error in likeTemplate: ${err}`);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.likeTemplate = likeTemplate;
const unlikeTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { templateId } = req.params;
        if (!templateId) {
            res.status(400).json({ message: 'Template ID is required' });
            return;
        }
        const userId = req.userId;
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        yield (0, templateQuery_1.unlikeTemplateQuery)(userId, parseInt(templateId));
        res.status(200).json({ message: 'Successfully unliked template' });
    }
    catch (err) {
        console.log(`Error in unlikeTemplate: ${err}`);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.unlikeTemplate = unlikeTemplate;

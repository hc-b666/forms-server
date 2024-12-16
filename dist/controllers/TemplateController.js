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
exports.createComment = exports.getForm = exports.getForms = exports.hasUserSubmittedForm = exports.createForm = exports.unlikeTemplate = exports.likeTemplate = exports.getProfile = exports.getTemplateById = exports.getLatestTemplates = exports.getTopTemplates = exports.createTemplate = void 0;
const templateQuery_1 = require("../models/queries/templateQuery");
const questionQuery_1 = require("../models/queries/questionQuery");
const tagQuery_1 = require("../models/queries/tagQuery");
const userQuery_1 = require("../models/queries/userQuery");
const formQuery_1 = require("../models/queries/formQuery");
const commentQuery_1 = require("../models/queries/commentQuery");
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
        const templateId = yield (0, templateQuery_1.createTemplateQuery)(userId, title, description, topic, type === 'public' ? true : false);
        yield (0, questionQuery_1.createQuestionsQuery)({ templateId, questions });
        yield (0, tagQuery_1.createTagsQuery)({ templateId, tags });
        res.status(200).json({ message: 'Successfully created template' });
    }
    catch (err) {
        console.log(`Error in createTemplate: ${err}`);
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
        const templates = yield (0, templateQuery_1.getLatestTemplatesQuery)();
        res.status(200).json(templates);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.getLatestTemplates = getLatestTemplates;
const getTemplateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { templateId } = req.params;
        const template = yield (0, templateQuery_1.getTemplateByIdQuery)(templateId);
        if (template === null) {
            res.status(404).json({ message: `Template with id ${templateId} not found` });
            return;
        }
        res.status(200).json(template);
    }
    catch (err) {
        console.log(`Error in getTemplateById: ${err}`);
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
const createForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { responses } = req.body;
        if (!responses || responses.length === 0) {
            res.status(400).json({ message: 'Responses are required' });
            return;
        }
        yield (0, formQuery_1.createFormQuery)({ filledBy: userId, templateId: templateId, responses });
        res.status(200).json({ message: 'Successfully submitted!' });
    }
    catch (err) {
        console.log(`Error in createForm: ${err}`);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.createForm = createForm;
const hasUserSubmittedForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const hasSubmitted = yield (0, formQuery_1.hasUserSubmittedFormQuery)(userId, parseInt(templateId));
        res.status(200).json({ hasSubmitted });
    }
    catch (err) {
        console.log(`Error in hasUserSubmittedForm: ${err}`);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.hasUserSubmittedForm = hasUserSubmittedForm;
const getForms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templateId = req.templateId;
        if (!templateId) {
            res.status(400).json({ message: 'Template ID is required' });
            return;
        }
        const template = yield (0, templateQuery_1.getTemplateByIdQuery)(templateId);
        const forms = yield (0, formQuery_1.getFormsQuery)(templateId);
        res.status(200).json({ forms, template });
    }
    catch (err) {
        console.log(`Error in getForms: ${err}`);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.getForms = getForms;
const getForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formId } = req.params;
        if (!formId) {
            res.status(400).json({ message: 'Form ID is required' });
            return;
        }
        const responses = yield (0, formQuery_1.getFormQuery)(parseInt(formId));
        res.status(200).json(responses);
    }
    catch (err) {
        console.log(`Error in getForm: ${err}`);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.getForm = getForm;
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { content } = req.body;
        if (!content) {
            res.status(400).json({ message: 'Content is required' });
            return;
        }
        yield (0, commentQuery_1.createCommentQuery)(userId, parseInt(templateId), content);
        res.status(200).json({ message: 'Successfully created comment' });
    }
    catch (err) {
        console.log(`Error in createComment: ${err}`);
        res.status(500).json({ message: 'Internal server err' });
    }
});
exports.createComment = createComment;

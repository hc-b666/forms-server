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
const templateService_1 = __importDefault(require("../services/templateService"));
const userService_1 = __importDefault(require("../services/userService"));
class TemplateController {
    constructor() {
        this.getTopTemplates = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templates = yield this.templateService.getTopTemplates();
                res.status(200).json(templates);
            }
            catch (err) {
                console.log(`Error in getTopTemplates: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.getLatestTemplates = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templates = yield this.templateService.getLatestTemplates();
                res.status(200).json(templates);
            }
            catch (err) {
                console.log(`Error in getLatestTemplates: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.getTemplateById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { templateId } = req.params;
                if (!templateId) {
                    res.status(400).json({ message: 'Template ID is required' });
                    return;
                }
                const template = yield this.templateService.getTemplateById(parseInt(templateId));
                if (!template) {
                    res
                        .status(404)
                        .json({ message: `Template with id ${templateId} not found` });
                    return;
                }
                res.status(200).json(template);
            }
            catch (err) {
                console.log(`Error in getTemplateById: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    res.status(400).json({ message: 'User ID is required' });
                    return;
                }
                const templates = yield this.templateService.getProfile(parseInt(userId));
                const user = yield this.userService.getUserById(parseInt(userId));
                res.status(200).json({ templates, user });
            }
            catch (err) {
                console.log(`Error in getProfile: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.getForms = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const templateId = req.templateId;
            if (!templateId) {
                res.status(400).json({ message: 'Template ID is required' });
                return;
            }
            const template = yield this.templateService.getTemplateById(templateId);
            const forms = yield this.templateService.getForms(templateId);
            res.status(200).json({ forms, template });
        });
        this.getForm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { formId } = req.params;
                if (!formId) {
                    res.status(400).json({ message: 'Form ID is required' });
                    return;
                }
                const responses = yield this.templateService.getForm(parseInt(formId));
                res.status(200).json(responses);
            }
            catch (err) {
                console.log(`Error in getForm: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.createTemplate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, topic, type, questions, tags } = req.body;
                if (!title || !description || !topic || questions.length === 0) {
                    res.status(400).json({
                        message: 'All inputs are required for creating the template',
                    });
                    return;
                }
                const userId = req.userId;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                yield this.templateService.createTemplate({
                    title,
                    description,
                    createdBy: userId,
                    topic,
                    type,
                    questions,
                    tags,
                });
                res.status(200).json({ message: 'Successfully created template' });
            }
            catch (err) {
                console.log(`Error in createTemplate: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.createForm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { templateId } = req.params;
            if (!templateId) {
                res.status(400).json({ message: 'Template ID is required' });
                return;
            }
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            const { responses } = req.body;
            if (!responses || responses.length === 0) {
                res.status(400).json({ message: 'Responses are required' });
                return;
            }
            yield this.templateService.createForm({
                filledBy: userId,
                templateId: parseInt(templateId),
                responses,
            });
            res.status(200).json({ message: 'Successfully submitted!' });
        });
        this.hasUserSubmittedForm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { templateId } = req.params;
                if (!templateId) {
                    res.status(400).json({ message: 'Template ID is required' });
                    return;
                }
                const userId = req.userId;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const hasSubmitted = yield this.templateService.hasUserSubmittedForm(userId, parseInt(templateId));
                res.status(200).json({ hasSubmitted });
            }
            catch (err) {
                console.log(`Error in hasUserSubmittedForm: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.createComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { templateId } = req.params;
                if (!templateId) {
                    res.status(400).json({ message: 'Template ID is required' });
                    return;
                }
                const userId = req.userId;
                if (!userId) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { content } = req.body;
                if (!content) {
                    res.status(400).json({ message: 'Content is required' });
                    return;
                }
                yield this.templateService.createComment(userId, parseInt(templateId), content);
                res.status(200).json({ message: 'Successfully created comment' });
            }
            catch (err) {
                console.log(`Error in createComment: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.templateService = new templateService_1.default();
        this.userService = new userService_1.default();
    }
}
exports.default = TemplateController;

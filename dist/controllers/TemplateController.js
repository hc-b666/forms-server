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
                const templates = yield this.templateService.getTemplatesByUserId(parseInt(userId));
                res.status(200).json(templates);
            }
            catch (err) {
                console.log(`Error in getProfile: ${err}`);
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
        this.templateService = templateService_1.default.getInstance();
        this.userService = userService_1.default.getInstance();
    }
}
exports.default = TemplateController;

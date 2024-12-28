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
const http_errors_1 = __importDefault(require("http-errors"));
const templateService_1 = __importDefault(require("../services/templateService"));
const validateInput_1 = require("../utils/validateInput");
class TemplateController {
    constructor() {
        this.getTopTemplates = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templates = yield this.templateService.getTopTemplates();
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.getLatestTemplates = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templates = yield this.templateService.getLatestTemplates();
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.getTemplateById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { templateId } = req.params;
                if (!templateId) {
                    throw (0, http_errors_1.default)(400, 'Template Id is required');
                }
                const template = yield this.templateService.getTemplateById(parseInt(templateId));
                if (!template) {
                    throw (0, http_errors_1.default)(400, `There is no template with ${templateId}`);
                }
                res.status(200).json(template);
            }
            catch (err) {
                next(err);
            }
        });
        this.getProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    throw (0, http_errors_1.default)(400, 'User id is required');
                }
                const templates = yield this.templateService.getTemplatesByUserId(parseInt(userId));
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.getPrivateTemplatesByUserId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const templates = yield this.templateService.getPrivateTemplatesByUserId(user.id);
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.getPrivateTemplatesForAccessibleUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                if (!user) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const templates = yield this.templateService.getPrivateTemplatesForAccessibleUser(user.id);
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.createTemplate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, topic, type, questions, tags, users } = req.body;
                (0, validateInput_1.validateInput)(req.body, ['title', 'description', 'topic', 'type', 'questions', 'tags']);
                const { userId } = req.params;
                if (!userId) {
                    throw (0, http_errors_1.default)(400, 'User id is required');
                }
                yield this.templateService.createTemplate({
                    title,
                    description,
                    createdBy: parseInt(userId),
                    topic,
                    type,
                    questions,
                    tags,
                    users,
                });
                res.status(200).json({ message: 'Successfully created template' });
            }
            catch (err) {
                next(err);
            }
        });
        this.searchTemplates = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.query;
                if (!query || typeof query !== 'string') {
                    throw (0, http_errors_1.default)(400, 'Query is required to search templates');
                }
                const templates = yield this.templateService.searchTemplates(query);
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.searchTemplatesByTagId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { tagId } = req.params;
                if (!tagId || tagId === 'null') {
                    const templates = yield this.templateService.getTemplates();
                    res.status(200).json(templates);
                    return;
                }
                const templates = yield this.templateService.getTemplatesByTagId(parseInt(tagId));
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.getTemplates = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templates = yield this.templateService.getTemplates();
                res.status(200).json(templates);
            }
            catch (err) {
                next(err);
            }
        });
        this.editTemplate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templateId = req.templateId;
                if (!templateId) {
                    throw (0, http_errors_1.default)(400, 'Template Id is required');
                }
                const { title, description, topic, tags } = req.body;
                (0, validateInput_1.validateInput)(req.body, ['title', 'description', 'topic', 'tags']);
                const result = yield this.templateService.editTemplateDetails(templateId, { title, description, topic, tags });
                if (!result) {
                    throw (0, http_errors_1.default)(400, 'Could not update template');
                }
                res.status(200).json({ message: 'Successfully updated template' });
            }
            catch (err) {
                next(err);
            }
        });
        this.deleteTemplate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templateId = req.templateId;
                if (!templateId) {
                    throw (0, http_errors_1.default)(400, 'Template Id is required');
                }
                yield this.templateService.deleteTemplate(templateId);
                res.status(200).json({ message: 'Successfully deleted template' });
            }
            catch (err) {
                next(err);
            }
        });
        this.templateService = templateService_1.default.getInstance();
    }
}
exports.default = TemplateController;

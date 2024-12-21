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
        this.createTemplate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { title, description, topic, type, questions, tags } = req.body;
                (0, validateInput_1.validateInput)(req.body, ['title', 'description', 'topic', 'type', 'questions', 'tags']);
                const createdBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!createdBy) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                yield this.templateService.createTemplate({
                    title,
                    description,
                    createdBy,
                    topic,
                    type,
                    questions,
                    tags,
                });
                res.status(200).json({ message: 'Successfully created template' });
            }
            catch (err) {
                next(err);
            }
        });
        this.templateService = templateService_1.default.getInstance();
    }
}
exports.default = TemplateController;

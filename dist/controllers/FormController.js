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
const formService_1 = __importDefault(require("../services/formService"));
const userService_1 = __importDefault(require("../services/userService"));
const responseService_1 = __importDefault(require("../services/responseService"));
class FormController {
    constructor() {
        this.getForms = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templateId = req.templateId;
                if (!templateId) {
                    throw (0, http_errors_1.default)(400, 'TemplateId is required');
                }
                const template = yield this.templateService.getTemplateById(templateId);
                const forms = yield this.formService.getForms(templateId);
                res.status(200).json({ forms, template });
            }
            catch (err) {
                next(err);
            }
        });
        this.getFormsByUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                if (!userId) {
                    throw (0, http_errors_1.default)(400, 'User Id is required');
                }
                const forms = yield this.formService.getFormsByUser(parseInt(userId));
                res.status(200).json(forms);
            }
            catch (err) {
                next(err);
            }
        });
        this.getForm = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { templateId } = req.params;
                if (!templateId) {
                    throw (0, http_errors_1.default)(400, 'Template Id is required');
                }
                const { formId } = req.params;
                if (!formId) {
                    throw (0, http_errors_1.default)(400, 'Ford Id is required');
                }
                const form = yield this.formService.getForm(parseInt(formId), parseInt(templateId));
                res.status(200).json(form);
            }
            catch (err) {
                next(err);
            }
        });
        this.createForm = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { templateId } = req.params;
                if (!templateId) {
                    throw (0, http_errors_1.default)(400, 'Template Id is required');
                }
                const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!authorId) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const { responses } = req.body;
                if (!responses || responses.length === 0) {
                    throw (0, http_errors_1.default)(400, 'Responses are requried to submit form');
                }
                yield this.formService.createForm({
                    authorId,
                    templateId: parseInt(templateId),
                    responses,
                });
                res.status(200).json({ message: 'Successfully submitted!' });
            }
            catch (err) {
                next(err);
            }
        });
        this.hasUserSubmittedForm = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { templateId } = req.params;
                if (!templateId) {
                    throw (0, http_errors_1.default)(400, 'Template Id is required');
                }
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const hasSubmitted = yield this.userService.hasUserSubmittedForm(userId, parseInt(templateId));
                res.status(200).json({ hasSubmitted });
            }
            catch (err) {
                next(err);
            }
        });
        this.editResponse = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { formId } = req.params;
                if (!formId) {
                    throw (0, http_errors_1.default)(400, 'Form Id is required');
                }
                const { questionId, answer, optionId, responseId, questionType, optionIds } = req.body;
                if (!questionId || !responseId || !questionType) {
                    throw (0, http_errors_1.default)(400, 'QuestionId, Answer, ResponseId and QuestionType are required');
                }
                yield this.responseService.editResponse(parseInt(formId), {
                    questionId,
                    answer,
                    optionId,
                    responseId,
                    questionType,
                    optionIds,
                });
                res.status(200).json({ message: 'Response updated successfully' });
            }
            catch (err) {
                next(err);
            }
        });
        this.deleteForm = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { formId } = req.params;
                if (!formId) {
                    throw (0, http_errors_1.default)(400, 'Form Id is required');
                }
                yield this.formService.deleteForm(parseInt(formId));
                res.status(200).json({ message: 'Form deleted successfully' });
            }
            catch (err) {
                next(err);
            }
        });
        this.templateService = templateService_1.default.getInstance();
        this.formService = formService_1.default.getInstance();
        this.userService = userService_1.default.getInstance();
        this.responseService = responseService_1.default.getInstance();
    }
}
exports.default = FormController;

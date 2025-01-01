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
const template_1 = require("../template");
const response_1 = require("../response");
const form_service_1 = __importDefault(require("./form.service"));
const createForm_dto_1 = require("./dto/createForm.dto");
class FormController {
    constructor() {
        this.validateId = (id, paramName) => {
            if (!id || isNaN(parseInt(id))) {
                throw (0, http_errors_1.default)(400, `${paramName} is required`);
            }
            return parseInt(id);
        };
        this.getByTemplateId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templateId = this.validateId(req.params.templateId, 'Template Id');
                const template = yield this.templateService.findById(templateId);
                const forms = yield this.formService.findByTemplateId(templateId);
                res.status(200).json({ forms, template });
            }
            catch (err) {
                next(err);
            }
        });
        this.getByUserId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateId(req.params.userId, 'User Id');
                const forms = yield this.formService.findByUserId(userId);
                res.status(200).json(forms);
            }
            catch (err) {
                next(err);
            }
        });
        this.getById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const templateId = this.validateId(req.params.templateId, 'Template Id');
                const formId = this.validateId(req.params.formId, 'Form Id');
                const form = yield this.formService.findById(formId, templateId);
                res.status(200).json(form);
            }
            catch (err) {
                next(err);
            }
        });
        this.hasSubmittedForm = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const templateId = this.validateId(req.params.templateId, 'Template Id');
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (userId) {
                    const hasSubmitted = yield this.formService.hasSubmittedForm(userId, templateId);
                    res.status(200).json({ hasSubmitted });
                }
                else {
                    res.json({ hasSubmitted: false });
                }
            }
            catch (err) {
                next(err);
            }
        });
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const templateId = this.validateId(req.params.templateId, 'Template Id');
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    throw (0, http_errors_1.default)(401, 'Unauthorized');
                }
                const result = createForm_dto_1.createFormSchema.safeParse(req.body);
                if (!result.success) {
                    const firstError = result.error.errors[0];
                    throw (0, http_errors_1.default)(400, firstError.message);
                }
                yield this.formService.create(userId, templateId, result.data);
                res.status(201).json({ message: 'Successfully created!' });
            }
            catch (err) {
                next(err);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const formId = this.validateId(req.params.formId, 'Form Id');
                const result = response_1.updateResponseSchema.safeParse(req.body);
                if (!result.success) {
                    const firstError = result.error.errors[0];
                    throw (0, http_errors_1.default)(400, firstError.message);
                }
                yield this.responseService.update(formId, result.data);
                res.status(200).json({ message: 'Successfully updated!' });
            }
            catch (err) {
                next(err);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const formId = this.validateId(req.params.formId, 'Form Id');
                yield this.formService.delete(formId);
                res.status(200).json({ message: 'Successfully deleted!' });
            }
            catch (err) {
                next(err);
            }
        });
        this.templateService = template_1.TemplateService.getInstance();
        this.responseService = response_1.ResponseService.getInstance();
        this.formService = form_service_1.default.getInstance();
    }
}
exports.default = new FormController();

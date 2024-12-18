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
const formService_1 = __importDefault(require("../services/formService"));
const userService_1 = __importDefault(require("../services/userService"));
class FormController {
    constructor() {
        this.getForms = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const templateId = req.templateId;
            if (!templateId) {
                res.status(400).json({ message: 'Template ID is required' });
                return;
            }
            const template = yield this.templateService.getTemplateById(templateId);
            const forms = yield this.formService.getForms(templateId);
            res.status(200).json({ forms, template });
        });
        this.getForm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { formId } = req.params;
                if (!formId) {
                    res.status(400).json({ message: 'Form ID is required' });
                    return;
                }
                const responses = yield this.formService.getForm(parseInt(formId));
                res.status(200).json(responses);
            }
            catch (err) {
                console.log(`Error in getForm: ${err}`);
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
            yield this.formService.createForm({
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
                const hasSubmitted = yield this.userService.hasUserSubmittedForm(userId, parseInt(templateId));
                res.status(200).json({ hasSubmitted });
            }
            catch (err) {
                console.log(`Error in hasUserSubmittedForm: ${err}`);
                res.status(500).json({ message: 'Internal server err' });
            }
        });
        this.templateService = templateService_1.default.getInstance();
        this.formService = formService_1.default.getInstance();
        this.userService = userService_1.default.getInstance();
    }
}
exports.default = FormController;

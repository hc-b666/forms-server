"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const FormController_1 = __importDefault(require("../controllers/FormController"));
const router = express_1.default.Router();
const authMiddleware = new AuthMiddleware_1.default();
const formController = new FormController_1.default();
router.get('/user', authMiddleware.authenticate, formController.getFormsByUser);
router.get('/:templateId([0-9]+)', authMiddleware.authenticate, authMiddleware.isAuthor, formController.getForms);
router.get('/:templateId([0-9]+)/responses/:formId([0-9]+)', authMiddleware.authenticate, authMiddleware.isAuthor, formController.getForm);
router.get('/check/:templateId([0-9]+)', authMiddleware.authenticate, formController.hasUserSubmittedForm);
router.post('/submit/:templateId([0-9]+)', authMiddleware.authenticate, formController.createForm);
router.put('/:formId([0-9]+)', authMiddleware.authenticate, authMiddleware.isFormAuthor, formController.editResponse);
router.delete('/:formId([0-9]+)', authMiddleware.authenticate, authMiddleware.isFormAuthor, formController.deleteForm);
exports.default = router;

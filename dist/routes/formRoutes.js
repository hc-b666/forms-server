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
router.get('/:templateId', authMiddleware.authenticate, authMiddleware.isAuthor, formController.getForms);
router.get('/:templateId/responses/:formId', authMiddleware.authenticate, authMiddleware.isAuthor, formController.getForm);
router.post('/check/:templateId', authMiddleware.authenticate, formController.hasUserSubmittedForm);
router.post('/submit/:templateId', authMiddleware.authenticate, formController.createForm);
exports.default = router;

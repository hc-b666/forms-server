"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const TemplateController_1 = __importDefault(require("../controllers/TemplateController"));
const router = express_1.default.Router();
const authMiddleware = new AuthMiddleware_1.default();
const templateController = new TemplateController_1.default();
router.get('/top', templateController.getTopTemplates);
router.get('/latest', templateController.getLatestTemplates);
router.get('/:templateId([0-9]+)', templateController.getTemplateById);
router.get('/profile/:userId([0-9]+)', authMiddleware.authenticate, templateController.getProfile);
router.post('/create', authMiddleware.authenticate, templateController.createTemplate);
exports.default = router;

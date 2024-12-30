"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const TemplateController_1 = __importDefault(require("../controllers/TemplateController"));
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024,
    },
});
const router = express_1.default.Router();
const authMiddleware = new AuthMiddleware_1.default();
const templateController = new TemplateController_1.default();
router.get('/', templateController.getTemplates);
router.get('/top', templateController.getTopTemplates);
router.get('/latest', templateController.getLatestTemplates);
router.get('/:templateId([0-9]+)', templateController.getTemplateById);
router.get('/search', templateController.searchTemplates);
router.get('/search/:tagId', templateController.searchTemplatesByTagId);
router.get('/profile/:userId([0-9]+)', authMiddleware.authenticate, templateController.getProfile);
router.get('/profile/private/:userId([0-9]+)', authMiddleware.authenticate, templateController.getPrivateTemplatesByUserId);
router.get('/profile/private/templates/:userId([0-9]+)', authMiddleware.authenticate, templateController.getPrivateTemplatesForAccessibleUser);
router.post('/create/:userId([0-9]+)', upload.single('image'), authMiddleware.authenticate, templateController.createTemplate);
router.put('/:templateId([0-9]+)', authMiddleware.authenticate, authMiddleware.isTemplateAuthor, templateController.editTemplate);
router.delete('/:templateId([0-9]+)', authMiddleware.authenticate, authMiddleware.isTemplateAuthor, templateController.deleteTemplate);
exports.default = router;

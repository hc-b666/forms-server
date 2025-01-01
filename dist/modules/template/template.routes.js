"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const authMiddleware_controller_1 = __importDefault(require("../../middlewares/authMiddleware.controller"));
const template_controller_1 = __importDefault(require("./template.controller"));
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fieldSize: 5 * 1024 * 1024,
    },
});
const router = express_1.default.Router();
router.get('/', template_controller_1.default.getAll);
router.get('/top', template_controller_1.default.getTop);
router.get('/latest', template_controller_1.default.getLatest);
router.get('/:templateId([0-9]+)', template_controller_1.default.getById);
router.get('/search', template_controller_1.default.search);
router.get('/search/:tagId', template_controller_1.default.getByTagId);
router.get('/profile/:userId([0-9]+)', authMiddleware_controller_1.default.authenticate, template_controller_1.default.getPublicByUserId);
router.get('/profile/private/:userId([0-9]+)', authMiddleware_controller_1.default.authenticate, template_controller_1.default.getPrivateByUserId);
router.get('/profile/private/templates/:userId([0-9]+)', authMiddleware_controller_1.default.authenticate, template_controller_1.default.getPrivateAccessibleByUserId);
router.post('/create/:userId([0-9]+)', upload.single('image'), authMiddleware_controller_1.default.authenticate, template_controller_1.default.create);
router.put('/:templateId([0-9]+)', authMiddleware_controller_1.default.authenticate, authMiddleware_controller_1.default.isTemplateAuthor, template_controller_1.default.updateDetails);
router.delete('/:templateId([0-9]+)', authMiddleware_controller_1.default.authenticate, authMiddleware_controller_1.default.isTemplateAuthor, template_controller_1.default.delete);
exports.default = router;

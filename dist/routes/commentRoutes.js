"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CommentController_1 = __importDefault(require("../controllers/CommentController"));
const AuthMiddleware_1 = __importDefault(require("../middlewares/AuthMiddleware"));
const router = express_1.default.Router();
const authMiddleware = new AuthMiddleware_1.default();
const commentController = new CommentController_1.default();
router.get('/:templateId([0-9]+)', commentController.getCommentsByTemplateId);
router.post('/create/:templateId([0-9]+)', authMiddleware.authenticate, commentController.createComment);
exports.default = router;

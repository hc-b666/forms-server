import express from 'express';
import CommentController from '../controllers/CommentController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const commentController = new CommentController();

router.get('/:templateId([0-9]+)', authMiddleware.authenticate, commentController.getCommentsByTemplateId);
router.post('/create/:templateId([0-9]+)', authMiddleware.authenticate, commentController.createComment);

export default router;

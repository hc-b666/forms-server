import express from 'express';
import CommentController from '../controllers/CommentController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const commentController = new CommentController();

router.post('/create/:templateId', authMiddleware.authenticate, commentController.createComment);

export default router;

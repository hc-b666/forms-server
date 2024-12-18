import express from 'express';
import CommentController from '../controllers/CommentController';

const router = express.Router();
const commentController = new CommentController();

router.get('/create/:templateId', commentController.createComment);

export default router;

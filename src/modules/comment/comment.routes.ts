import { Router } from 'express';
import AuthMiddleware from '../../middlewares/authMiddleware.controller';
import commentController from './comment.controller';

const router = Router();

router.get('/:templateId([0-9]+)', commentController.findComments);
router.post('/create/:templateId([0-9]+)', AuthMiddleware.authenticate, commentController.create);

export default router;

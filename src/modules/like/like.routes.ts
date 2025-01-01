import { Router } from 'express';
import AuthMiddleware from '../../middlewares/authMiddleware.controller';
import likeController from './like.controller';

const router = Router();

router.get('/:templateId([0-9]+)', AuthMiddleware.addUserToRequest, likeController.findLikes);

router.post('/:templateId([0-9]+)', AuthMiddleware.authenticate, likeController.toggleLike);

export default router;

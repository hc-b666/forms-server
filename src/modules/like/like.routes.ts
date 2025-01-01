import { Router } from 'express';
import { AuthMiddleware } from '../../utils/auth-middleware';
import likeController from './like.controller';

const router = Router();

router.get('/:templateId([0-9]+)', AuthMiddleware.addUserToRequest, likeController.findLikes);

router.post('/:templateId([0-9]+)', AuthMiddleware.authenticate, likeController.toggleLike);

export default router;

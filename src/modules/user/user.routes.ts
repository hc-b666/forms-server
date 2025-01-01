import { Router } from 'express';
import { AuthMiddleware } from '../../utils/auth-middleware';
import userController from './user.controller';

const router = Router();

router.get(
  '/profile/:userId([0-9]+)',
  AuthMiddleware.authenticate,
  userController.findById
);

router.get(
  '/search',
  AuthMiddleware.authenticate,
  userController.searchByEmail
);

export default router;

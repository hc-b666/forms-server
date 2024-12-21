import express from 'express';

import AuthMiddleware from '../middlewares/AuthMiddleware';
import UserController from '../controllers/userController';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const userController = new UserController();

router.get('/users', authMiddleware.authenticate, authMiddleware.isAdmin, userController.getUsers);

export default router;


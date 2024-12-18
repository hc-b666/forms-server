import express from 'express';
import UserController from '../controllers/userController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const userController = new UserController();

router.get('/profile/:userId', authMiddleware.authenticate, userController.getUserById);

export default router;
import express from 'express';
import UserController from '../controllers/userController';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const userController = new UserController();

router.get('/profile/:userId([0-9]+)', authMiddleware.authenticate, userController.getUserById);

export default router;

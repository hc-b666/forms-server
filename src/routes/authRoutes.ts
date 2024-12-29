import express from 'express';
import AuthController from '../controllers/AuthController';

const router = express.Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/verify', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

export default router;

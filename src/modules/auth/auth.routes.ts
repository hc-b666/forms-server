import { Router } from "express";
import AuthController from "./auth.controller";

const router = Router();

router.post('/register', AuthController.register);
router.post('/verify', AuthController.verify);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

export default router;

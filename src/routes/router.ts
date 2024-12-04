import express from 'express';
import * as AuthController from '../controllers/AuthController';
import * as TemplateController from '../controllers/TemplateController';

import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'We got your request!' });
});

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/validate-token', AuthController.validateToken);

router.get('/templates/top5', TemplateController.getTop5Templates);
router.get('/templates/latest', TemplateController.latestTemplates);
router.post('/templates/create', authMiddleware, TemplateController.createTemplate);
router.post('/templates/like', authMiddleware, TemplateController.likeTemplate);

export default router;

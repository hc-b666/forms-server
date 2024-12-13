import express from 'express';
import * as AuthController from '../controllers/AuthController';
import * as TemplateController from '../controllers/TemplateController';
import * as TagController from '../controllers/TagController';

import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = express.Router();

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/validate-token', AuthController.validateToken);

router.get('/templates/top5', TemplateController.getTopTemplates);
router.get('/templates/latest', TemplateController.getLatestTemplates);

router.get('/templates/:id', TemplateController.getTemplateById);

router.get('/templates/profile/:userId', authMiddleware, TemplateController.getProfile);
router.post('/templates/create', authMiddleware, TemplateController.createTemplate);
// router.patch('/templates/update/:templateId', authMiddleware, TemplateController.updateTemplate);
// router.delete('/templates/delete/:templateId', authMiddleware, TemplateController.deleteTemplate);

router.post('/templates/like/:templateId', authMiddleware, TemplateController.likeTemplate);
router.post('/templates/unlike/:templateId', authMiddleware, TemplateController.unlikeTemplate);

// router.post('/templates/comment/:templateId', authMiddleware, TemplateController.commentOnTemplate);

router.get('/tags', TagController.getTags);

router.post('/forms/submit/:templateId', authMiddleware, TemplateController.createForm);
router.post('/forms/check/:templateId', authMiddleware, TemplateController.hasUserSubmittedForm);

export default router;

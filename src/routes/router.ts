import express from 'express';

import { authMiddleware } from '../middlewares/AuthMiddleware';
import { isAuthorMiddleware } from '../middlewares/IsAuthorMiddleware';
import AuthController from '../controllers/AuthController';
import TemplateController from '../controllers/TemplateController';
import TagController from '../controllers/TagController';

const router = express.Router();
const authController = new AuthController();
const templateController = new TemplateController();
const tagController = new TagController();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh-token', authController.refreshToken);

router.get('/templates/top', templateController.getTopTemplates);
router.get('/templates/latest', templateController.getLatestTemplates);
router.get('/templates/:templateId', templateController.getTemplateById);
router.get('/templates/profile/:userId', authMiddleware, templateController.getProfile);
router.get('/forms/:templateId', authMiddleware, isAuthorMiddleware, templateController.getForms);

router.post('/templates/create', authMiddleware, templateController.createTemplate);
router.post('/forms/check/:templateId', authMiddleware, templateController.hasUserSubmittedForm);

// router.post('/templates/like/:templateId', authMiddleware, TemplateController.likeTemplate);
// router.post('/templates/unlike/:templateId', authMiddleware, TemplateController.unlikeTemplate);

router.get('/tags', tagController.getTags);
router.get('/tags/search', authMiddleware, tagController.searchTags);

router.post('/forms/submit/:templateId', authMiddleware, templateController.createForm);
router.get('/forms/:templateId/responses/:formId', authMiddleware, isAuthorMiddleware, templateController.getForm);

router.post('/comments/create/:templateId', authMiddleware, templateController.createComment);

export default router;

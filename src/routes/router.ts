import express from 'express';

import AuthMiddleware from '../middlewares/AuthMiddleware';
import AuthController from '../controllers/AuthController';
import TemplateController from '../controllers/TemplateController';
import TagController from '../controllers/TagController';

const router = express.Router();
const authController = new AuthController();
const templateController = new TemplateController();
const tagController = new TagController();
const authMiddleware = new AuthMiddleware();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh-token', authController.refreshToken);

router.get('/templates/top', templateController.getTopTemplates);
router.get('/templates/latest', templateController.getLatestTemplates);
router.get('/templates/:templateId', templateController.getTemplateById);
router.get(
  '/templates/profile/:userId',
  authMiddleware.authenticate,
  templateController.getProfile
);
router.get(
  '/forms/:templateId',
  authMiddleware.authenticate,
  authMiddleware.isAuthor,
  templateController.getForms
);

router.post(
  '/templates/create',
  authMiddleware.authenticate,
  templateController.createTemplate
);
router.post(
  '/forms/check/:templateId',
  authMiddleware.authenticate,
  templateController.hasUserSubmittedForm
);

router.get('/tags', tagController.getTags);
router.get(
  '/tags/search',
  authMiddleware.authenticate,
  tagController.searchTags
);

router.post(
  '/forms/submit/:templateId',
  authMiddleware.authenticate,
  templateController.createForm
);
router.get(
  '/forms/:templateId/responses/:formId',
  authMiddleware.authenticate,
  authMiddleware.isAuthor,
  templateController.getForm
);

router.post(
  '/comments/create/:templateId',
  authMiddleware.authenticate,
  templateController.createComment
);

// router.post('/templates/like/:templateId', authMiddleware, TemplateController.likeTemplate);
// router.post('/templates/unlike/:templateId', authMiddleware, TemplateController.unlikeTemplate);

export default router;

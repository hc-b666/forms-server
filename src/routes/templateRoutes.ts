import express from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import TemplateController from '../controllers/TemplateController';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const templateController = new TemplateController();

router.get('/', templateController.getTemplates);
router.get('/top', templateController.getTopTemplates);
router.get('/latest', templateController.getLatestTemplates);
router.get('/:templateId([0-9]+)', templateController.getTemplateById);
router.get('/search', templateController.searchTemplates);
router.get('/search/:tagId', templateController.searchTemplatesByTagId);

router.get('/profile/:userId([0-9]+)', authMiddleware.authenticate, templateController.getProfile);
router.get('/profile/private', authMiddleware.authenticate, templateController.getPrivateTemplatesByUserId);
router.get('/profile/private/templates', authMiddleware.authenticate, templateController.getPrivateTemplatesForAccessibleUser);

router.post('/create', authMiddleware.authenticate, templateController.createTemplate);

export default router;

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
router.get('/search/:tagId([0-9]+)', templateController.searchTemplatesByTagId);

router.get('/profile/:userId([0-9]+)', authMiddleware.authenticate, templateController.getProfile);
router.get('/profile/private/:userId([0-9]+)', authMiddleware.authenticate, templateController.getPrivateTemplatesByUserId);
router.get('/profile/private/templates/:userId([0-9]+)', authMiddleware.authenticate, templateController.getPrivateTemplatesForAccessibleUser);

router.post('/create/:userId([0-9]+)', authMiddleware.authenticate, templateController.createTemplate);

router.put('/:templateId([0-9]+)', authMiddleware.authenticate, authMiddleware.isTemplateAuthor, templateController.editTemplate);

router.delete('/:templateId([0-9]+)', authMiddleware.authenticate, authMiddleware.isTemplateAuthor, templateController.deleteTemplate);

export default router;

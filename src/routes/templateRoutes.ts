import express from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import TemplateController from '../controllers/TemplateController';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const templateController = new TemplateController();

router.get('/top', templateController.getTopTemplates);
router.get('/latest', templateController.getLatestTemplates);
router.get('/:templateId', templateController.getTemplateById);

router.get('/profile/:userId', authMiddleware.authenticate, templateController.getProfile);

router.post('/create', authMiddleware.authenticate, templateController.createTemplate);

export default router;

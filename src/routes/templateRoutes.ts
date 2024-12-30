import express from 'express';
import multer from 'multer';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import TemplateController from '../controllers/TemplateController';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 5 * 1024 * 1024,
  },
});

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
router.get('/profile/private/:userId([0-9]+)', authMiddleware.authenticate, templateController.getPrivateTemplatesByUserId);
router.get('/profile/private/templates/:userId([0-9]+)', authMiddleware.authenticate, templateController.getPrivateTemplatesForAccessibleUser);

router.post('/create/:userId([0-9]+)', upload.single('image'), authMiddleware.authenticate, templateController.createTemplate);

router.put('/:templateId([0-9]+)', authMiddleware.authenticate, authMiddleware.isTemplateAuthor, templateController.editTemplate);

router.delete('/:templateId([0-9]+)', authMiddleware.authenticate, authMiddleware.isTemplateAuthor, templateController.deleteTemplate);

export default router;

import express from 'express';
import multer from 'multer';
import { AuthMiddleware } from '../../utils/auth-middleware';
import templateController from './template.controller';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

router.get('/', templateController.getAll);
router.get('/top', templateController.getTop);
router.get('/latest', templateController.getLatest);
router.get('/:templateId([0-9]+)', templateController.getById);
router.get('/search', templateController.search);
router.get('/search/:tagId', templateController.getByTagId);

router.get('/profile/:userId([0-9]+)', AuthMiddleware.authenticate, templateController.getPublicByUserId);
router.get('/profile/private/:userId([0-9]+)', AuthMiddleware.authenticate, templateController.getPrivateByUserId);
router.get('/profile/private/templates/:userId([0-9]+)', AuthMiddleware.authenticate, templateController.getPrivateAccessibleByUserId);

router.post('/create/:userId([0-9]+)', upload.single('image'), AuthMiddleware.authenticate, templateController.create);

router.put('/:templateId([0-9]+)', AuthMiddleware.authenticate, AuthMiddleware.isTemplateAuthor, templateController.updateDetails);

router.delete('/:templateId([0-9]+)', AuthMiddleware.authenticate, AuthMiddleware.isTemplateAuthor, templateController.delete);

export default router;

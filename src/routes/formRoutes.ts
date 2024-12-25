import express from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import FormController from '../controllers/FormController';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const formController = new FormController();

router.get('/user', authMiddleware.authenticate, formController.getFormsByUser);

router.get(
  '/:templateId([0-9]+)',
  authMiddleware.authenticate,
  authMiddleware.isAuthor,
  formController.getForms
);

router.get(
  '/:templateId([0-9]+)/responses/:formId([0-9]+)',
  authMiddleware.authenticate,
  authMiddleware.isAuthor,
  formController.getForm
);

router.get(
  '/check/:templateId([0-9]+)',
  authMiddleware.authenticate,
  formController.hasUserSubmittedForm
);

router.post(
  '/submit/:templateId([0-9]+)',
  authMiddleware.authenticate,
  formController.createForm
);

export default router;

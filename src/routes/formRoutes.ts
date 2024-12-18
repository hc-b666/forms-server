import express from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import FormController from '../controllers/FormController';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const formController = new FormController();

router.get(
  '/:templateId',
  authMiddleware.authenticate,
  authMiddleware.isAuthor,
  formController.getForms
);

router.get(
  '/:templateId/responses/:formId',
  authMiddleware.authenticate,
  authMiddleware.isAuthor,
  formController.getForm
);

router.post(
  '/check/:templateId',
  authMiddleware.authenticate,
  formController.hasUserSubmittedForm
);

router.post(
  '/submit/:templateId',
  authMiddleware.authenticate,
  formController.createForm
);

export default router;

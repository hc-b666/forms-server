import { Router } from 'express';
import { AuthMiddleware } from '../../utils/auth-middleware';
import formController from './form.controller';

const router = Router();

router.get(
  '/user/:userId([0-9]+)',
  AuthMiddleware.authenticate,
  formController.getByUserId
);

router.get(
  '/:templateId([0-9]+)',
  AuthMiddleware.authenticate,
  AuthMiddleware.isTemplateAuthor,
  formController.getByTemplateId
);

router.get(
  '/:templateId([0-9]+)/responses/:formId([0-9]+)',
  AuthMiddleware.authenticate,
  AuthMiddleware.isAuthor,
  formController.getById
);

router.get(
  '/check/:templateId([0-9]+)',
  AuthMiddleware.addUserToRequest,
  formController.hasSubmittedForm
);

router.post(
  '/submit/:templateId([0-9]+)',
  AuthMiddleware.authenticate,
  formController.create
);

router.put(
  '/:formId([0-9]+)',
  AuthMiddleware.authenticate,
  AuthMiddleware.isFormAuthor,
  formController.update
);

router.delete(
  '/:formId([0-9]+)',
  AuthMiddleware.authenticate,
  AuthMiddleware.isFormAuthor,
  formController.delete
);

export default router;

import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import TemplateService from '../services/templateService';
import FormService from '../services/formService';
import UserService from '../services/userService';

class FormController {
  private templateService: TemplateService;
  private formService: FormService;
  private userService: UserService;

  constructor() {
    this.templateService = TemplateService.getInstance();
    this.formService = FormService.getInstance();
    this.userService = UserService.getInstance();
  }

  getForms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templateId = req.templateId;
      if (!templateId) {
        throw createHttpError(400, 'TemplateId is required');
      }

      const template = await this.templateService.getTemplateById(templateId);
      const forms = await this.formService.getForms(templateId);

      res.status(200).json({ forms, template });
    } catch (err) {
      next(err);
    }
  };

  getFormsByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }

      const forms = await this.formService.getFormsByUser(userId);

      res.status(200).json(forms);
    } catch (err) {
      next(err);
    }
  };

  getForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { formId } = req.params;
      if (!formId) {
        throw createHttpError(400, 'Ford Id is required');
      }

      const responses = await this.formService.getForm(parseInt(formId));

      res.status(200).json(responses);
    } catch (err) {
      next(err);
    }
  };

  createForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateId } = req.params;
      if (!templateId) {
        throw createHttpError(400, 'Template Id is required');
      }
  
      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }
  
      const { responses } = req.body;
      if (!responses || responses.length === 0) {
        throw createHttpError(400, 'Responses are requried to submit form');
      }
  
      await this.formService.createForm({
        filledBy: userId,
        templateId: parseInt(templateId),
        responses,
      });
  
      res.status(200).json({ message: 'Successfully submitted!' });
    } catch (err) {
      next(err);
    }
  };

  hasUserSubmittedForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateId } = req.params;
      if (!templateId) {
        throw createHttpError(400, 'Template Id is required');
      }

      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }

      const hasSubmitted = await this.userService.hasUserSubmittedForm(userId, parseInt(templateId));

      res.status(200).json({ hasSubmitted });
    } catch (err) {
      next(err);
    }
  };
}

export default FormController;

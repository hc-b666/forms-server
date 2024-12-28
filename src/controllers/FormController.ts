import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

import TemplateService from '../services/templateService';
import FormService from '../services/formService';
import UserService from '../services/userService';
import ResponseService from '../services/responseService';

class FormController {
  private templateService: TemplateService;
  private formService: FormService;
  private userService: UserService;
  private responseService: ResponseService;

  constructor() {
    this.templateService = TemplateService.getInstance();
    this.formService = FormService.getInstance();
    this.userService = UserService.getInstance();
    this.responseService = ResponseService.getInstance();
  }

  getForms: RequestHandler = async (req, res, next) => {
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

  getFormsByUser: RequestHandler = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'User Id is required');
      }

      const forms = await this.formService.getFormsByUser(parseInt(userId));

      res.status(200).json(forms);
    } catch (err) {
      next(err);
    }
  };

  getForm: RequestHandler = async (req, res, next) => {
    try {
      const { templateId } = req.params;
      if (!templateId) {
        throw createHttpError(400, 'Template Id is required');
      }

      const { formId } = req.params;
      if (!formId) {
        throw createHttpError(400, 'Ford Id is required');
      }

      const form = await this.formService.getForm(parseInt(formId), parseInt(templateId));

      res.status(200).json(form);
    } catch (err) {
      next(err);
    }
  };

  createForm: RequestHandler = async (req, res, next) => {
    try {
      const { templateId } = req.params;
      if (!templateId) {
        throw createHttpError(400, 'Template Id is required');
      }
  
      const authorId = req.user?.id;
      if (!authorId) {
        throw createHttpError(401, 'Unauthorized');
      }
  
      const { responses } = req.body;
      if (!responses || responses.length === 0) {
        throw createHttpError(400, 'Responses are requried to submit form');
      }
  
      await this.formService.createForm({
        authorId,
        templateId: parseInt(templateId),
        responses,
      });
  
      res.status(200).json({ message: 'Successfully submitted!' });
    } catch (err) {
      next(err);
    }
  };

  hasUserSubmittedForm: RequestHandler = async (req, res, next) => {
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

  editResponse: RequestHandler = async (req, res, next) => {
    try {
      const { formId } = req.params;
      if (!formId) {
        throw createHttpError(400, 'Form Id is required');
      }

      const { questionId, answer, optionId, responseId, questionType, optionIds } = req.body as EditResponseData;
      if (!questionId || !responseId || !questionType) {
        throw createHttpError(400, 'QuestionId, Answer, ResponseId and QuestionType are required');
      }

      await this.responseService.editResponse(parseInt(formId), {
        questionId,
        answer,
        optionId,
        responseId,
        questionType,
        optionIds,
      });

      res.status(200).json({ message: 'Response updated successfully' });
    } catch (err) {
      next(err);
    }
  };

  deleteForm: RequestHandler = async (req, res, next) => {
    try {
      const { formId } = req.params;
      if (!formId) {
        throw createHttpError(400, 'Form Id is required');
      }

      await this.formService.deleteForm(parseInt(formId));

      res.status(200).json({ message: 'Form deleted successfully' });
    } catch (err) {
      next(err);
    }
  };
}

export default FormController;

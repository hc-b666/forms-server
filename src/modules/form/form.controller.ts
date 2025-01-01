import { type RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { TemplateService } from '../template';
import { ResponseService, updateResponseSchema } from '../response';
import FormService from './form.service';
import { createFormSchema } from './dto/createForm.dto';

class FormController {
  private templateService: TemplateService;
  private responseService: ResponseService;
  private formService: FormService;

  constructor() {
    this.templateService = TemplateService.getInstance();
    this.responseService = ResponseService.getInstance();
    this.formService = FormService.getInstance();
  }

  private validateId = (id: string, paramName: string) => {
    if (!id || isNaN(parseInt(id))) {
      throw createHttpError(400, `${paramName} is required`);
    }

    return parseInt(id);
  };

  getByTemplateId: RequestHandler = async (req, res, next) => {
    try {
      const templateId = this.validateId(req.params.templateId, 'Template Id');

      const template = await this.templateService.findById(templateId);
      const forms = await this.formService.findByTemplateId(templateId);

      res.status(200).json({ forms, template });
    } catch (err) {
      next(err);
    }
  };

  getByUserId: RequestHandler = async (req, res, next) => {
    try {
      const userId = this.validateId(req.params.userId, 'User Id');

      const forms = await this.formService.findByUserId(userId);

      res.status(200).json(forms);
    } catch (err) {
      next(err);
    }
  };

  getById: RequestHandler = async (req, res, next) => {
    try {
      const templateId = this.validateId(req.params.templateId, 'Template Id');
      const formId = this.validateId(req.params.formId, 'Form Id');

      const form = await this.formService.findById(formId, templateId);

      res.status(200).json(form);
    } catch (err) {
      next(err);
    }
  };

  hasSubmittedForm: RequestHandler = async (req, res, next) => {
    try {
      const templateId = this.validateId(req.params.templateId, 'Template Id');
      const userId = req.user?.id;
      if (userId) {
        const hasSubmitted = await this.formService.hasSubmittedForm(userId, templateId);

        res.status(200).json({ hasSubmitted });
      } else {
        res.json({ hasSubmitted: false });
      }

      
    } catch (err) {
      next(err);
    }
  };

  create: RequestHandler = async (req, res, next) => {
    try {
      const templateId = this.validateId(req.params.templateId, 'Template Id');
      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }

      const result = createFormSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0];
        throw createHttpError(400, firstError.message);
      }

      await this.formService.create(userId, templateId, result.data);

      res.status(201).json({ message: 'Successfully created!' });
    } catch (err) {
      next(err);
    }
  };

  update: RequestHandler = async (req, res, next) => {
    try {
      const formId = this.validateId(req.params.formId, 'Form Id');

      const result = updateResponseSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0];
        throw createHttpError(400, firstError.message);
      }
      
      await this.responseService.update(formId, result.data);

      res.status(200).json({ message: 'Successfully updated!' });
    } catch (err) {
      next(err);
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    try {
      const formId = this.validateId(req.params.formId, 'Form Id');

      await this.formService.delete(formId);

      res.status(200).json({ message: 'Successfully deleted!' });
    } catch (err) {
      next(err);
    }
  };
}

export default new FormController();

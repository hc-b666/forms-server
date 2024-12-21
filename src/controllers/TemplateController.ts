import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import TemplateService from '../services/templateService';
import { validateInput } from '../utils/validateInput';

class TemplateController {
  private templateService: TemplateService;

  constructor() {
    this.templateService = TemplateService.getInstance();
  }

  getTopTemplates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templates = await this.templateService.getTopTemplates();

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  getLatestTemplates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const templates = await this.templateService.getLatestTemplates();

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  getTemplateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateId } = req.params;
      if (!templateId) {
        throw createHttpError(400, 'Template Id is required');
      }

      const template = await this.templateService.getTemplateById(parseInt(templateId));
      if (!template) {
        throw createHttpError(400, `There is no template with ${templateId}`);
      }

      res.status(200).json(template);
    } catch (err) {
      next(err);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'User id is required');
      }

      const templates = await this.templateService.getTemplatesByUserId(parseInt(userId));

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  createTemplate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, topic, type, questions, tags } = req.body;
      validateInput(req.body, ['title', 'description', 'topic', 'type', 'questions', 'tags']);

      const createdBy = req.user?.id;
      if (!createdBy) {
        throw createHttpError(401, 'Unauthorized');
      }

      await this.templateService.createTemplate({
        title,
        description,
        createdBy,
        topic,
        type,
        questions,
        tags,
      });

      res.status(200).json({ message: 'Successfully created template' });
    } catch (err) {
      next(err);
    }
  };
}

export default TemplateController;

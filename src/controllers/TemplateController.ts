import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

import TemplateService from '../services/templateService';
import { validateInput } from '../utils/validateInput';

class TemplateController {
  private templateService: TemplateService;

  constructor() {
    this.templateService = TemplateService.getInstance();
  }

  getTopTemplates: RequestHandler = async (req, res, next) => {
    try {
      const templates = await this.templateService.getTopTemplates();

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  getLatestTemplates: RequestHandler = async (req, res, next) => {
    try {
      const templates = await this.templateService.getLatestTemplates();

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  getTemplateById: RequestHandler = async (req, res, next) => {
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

  getProfile: RequestHandler = async (req, res, next) => {
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

  getPrivateTemplatesByUserId: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        throw createHttpError(401, 'Unauthorized');
      }

      const templates = await this.templateService.getPrivateTemplatesByUserId(user.id);
      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  getPrivateTemplatesForAccessibleUser: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        throw createHttpError(401, 'Unauthorized');
      }

      const templates = await this.templateService.getPrivateTemplatesForAccessibleUser(user.id);
      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  createTemplate: RequestHandler = async (req, res, next) => {
    try {
      const { title, description, topic, type, questions, tags, users } = req.body;
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
        users,
      });

      res.status(200).json({ message: 'Successfully created template' });
    } catch (err) {
      next(err);
    }
  };
}

export default TemplateController;

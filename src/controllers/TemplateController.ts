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

  searchTemplates: RequestHandler = async (req, res, next) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        throw createHttpError(400, 'Query is required to search templates');
      }

      const templates = await this.templateService.searchTemplates(query);

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  searchTemplatesByTagId: RequestHandler = async (req, res, next) => {
    try {
      const { tagId } = req.params;
      if (!tagId || tagId === 'null') {
        const templates = await this.templateService.getTemplates();
        res.status(200).json(templates);
        return;
      }

      const templates = await this.templateService.getTemplatesByTagId(parseInt(tagId));

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  getTemplates: RequestHandler = async (req, res, next) => {
    try {
      const templates = await this.templateService.getTemplates();

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  editTemplate: RequestHandler = async (req, res, next) => {
    try {
      const templateId = req.templateId;
      if (!templateId) {
        throw createHttpError(400, 'Template Id is required');
      }

      const { title, description, topic, tags } = req.body;
      validateInput(req.body, ['title', 'description', 'topic', 'tags']);
      
      const result = await this.templateService.editTemplateDetails(templateId, { title, description, topic, tags });
      if (!result) {
        throw createHttpError(400, 'Could not update template');
      }

      res.status(200).json({ message: 'Successfully updated template' });
    } catch (err) {
      next(err);
    }
  };

  deleteTemplate: RequestHandler = async (req, res, next) => {
    try {
      const templateId = req.templateId;
      if (!templateId) {
        throw createHttpError(400, 'Template Id is required');
      }

      await this.templateService.deleteTemplate(templateId);

      res.status(200).json({ message: 'Successfully deleted template' });
    } catch (err) {
      next(err);
    }
  };
}

export default TemplateController;

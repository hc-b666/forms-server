import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { google } from 'googleapis';
import { Readable } from 'stream';

import TemplateService from '../services/templateService';
import { validateInput } from '../utils/validateInput';
import { PrismaClient } from '@prisma/client';

class TemplateController {
  private templateService: TemplateService;
  private prisma: PrismaClient;

  constructor() {
    this.templateService = TemplateService.getInstance();
    this.prisma = new PrismaClient();
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
      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'User id is required');
      }

      const templates = await this.templateService.getPrivateTemplatesByUserId(parseInt(userId));
      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  getPrivateTemplatesForAccessibleUser: RequestHandler = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'User id is required');
      }

      const templates = await this.templateService.getPrivateTemplatesForAccessibleUser(parseInt(userId));
      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  createTemplate: RequestHandler = async (req, res, next) => {
    try {
      const { title, description, topic, type, questions, tags, users } = req.body;
      validateInput(req.body, ['title', 'description', 'topic', 'type', 'questions', 'tags']);

      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'User id is required');
      }

      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

      const templateId = await this.templateService.createTemplate({
        title,
        description,
        createdBy: parseInt(userId),
        topic,
        type,
        questions: JSON.parse(questions),
        tags: JSON.parse(tags),
        users: JSON.parse(users),
      });

      const file = req.file;
      if (file) {
        const auth = new google.auth.GoogleAuth({
          credentials: {
            type: process.env.GOOGLE_TYPE,
            project_id: process.env.GOOGLE_PROJECT_ID,
            private_key: process.env.GOOGLE_PRIVATE_KEY,
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_CLIENT_ID,
          },
          scopes: ['https://www.googleapis.com/auth/drive'],
        });
    
        const drive = google.drive({ version: 'v3', auth });
    
        const fileStream = new Readable();
        fileStream.push(file.buffer);
        fileStream.push(null);
    
        const fileMetaData = {
          name: req.file?.originalname,
          mimeType: req.file?.mimetype,
        };
    
        const media = {
          mimeType: req.file?.mimetype,
          body: fileStream,
          parents: [folderId],
        };
    
        const response = await drive.files.create({
          requestBody: fileMetaData,
          media,
          fields: 'id, webViewLink',
        });
    
        await drive.permissions.create({
          fileId: response.data.id!,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
        
        const updatedFile = await drive.files.get({
          fileId: response.data.id!,
          fields: 'id, webViewLink',
        });

        await this.prisma.template.update({
          where: {
            id: templateId,
          },
          data: {
            imageId: updatedFile.data.id,
            imageUrl: `https://drive.google.com/uc?id=${updatedFile.data.id}`,
          },
        });
      }

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

      const { title, description, topic, tags, accessControls } = req.body;
      validateInput(req.body, ['title', 'description', 'topic', 'tags']);
      
      const result = await this.templateService.editTemplateDetails(templateId, { title, description, topic, tags, accessControls });
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

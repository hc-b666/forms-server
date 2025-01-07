import { type RequestHandler } from 'express';
import { type drive_v3, google } from 'googleapis';
import { Readable } from 'stream';
import createHttpError from 'http-errors';

import TemplateService from './template.service';
import { createTemplateSchema } from './dto/createTemplate.dto';
import { updateDetailsSchema } from './dto/updateDetails.dto';

class TemplateController {
  private templateService: TemplateService;
  private folderId: string;

  constructor() {
    this.templateService = TemplateService.getInstance();
    this.folderId = this.getFolderId();
  }

  private getFolderId(): string {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) {
      throw createHttpError(500, 'Internal server error. Sorry for the inconvenience.');
    }

    return folderId;
  }

  private validateId = (id: string, paramName: string) => {
    if (!id || isNaN(parseInt(id))) {
      throw createHttpError(400, `${paramName} is required`);
    }

    return parseInt(id);
  };

  getAll: RequestHandler = async (_req, res, next) => {
    try {
      const templates = await this.templateService.findAll();

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  getTop: RequestHandler = async (req, res, next) => {
    try {
      const templates = await this.templateService.findTop();

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  getLatest: RequestHandler = async (req, res, next) => {
    try {
      const templates = await this.templateService.findLatest();

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  getById: RequestHandler = async (req, res, next) => {
    try {
      const templateId = this.validateId(req.params.templateId, 'Template id');

      const template = await this.templateService.findById(templateId);
      if (!template) {
        throw createHttpError(404, `There is no template with id ${templateId}`);
      }

      res.status(200).json(template);
    } catch (err) {
      next(err);
    }
  };

  getPublicByUserId: RequestHandler = async (req, res, next) => {
    try {
      const userId = this.validateId(req.params.userId, 'User id');
      const page = parseInt(req.query.page as string) || 1;

      const response = await this.templateService.findPublicTemplatesByUserId(userId, page);

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getPrivateByUserId: RequestHandler = async (req, res, next) => {
    try {
      const userId = this.validateId(req.params.userId, 'User id');
      const page = parseInt(req.query.page as string) || 1;

      const response = await this.templateService.findPrivateTemplatesByUserId(userId, page);

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getPrivateAccessibleByUserId: RequestHandler = async (req, res, next) => {
    try {
      const userId = this.validateId(req.params.userId, 'User id');
      const page = parseInt(req.query.page as string) || 1;

      const response = await this.templateService.findPrivateAccessibleTemplatesByUserId(userId, page);

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getByTagId: RequestHandler = async (req, res, next) => {
    try {
      const { tagId } = req.params;
      if (!tagId || tagId === 'null') {
        const templates = await this.templateService.findAll();
        res.status(200).json(templates);
        return;
      }

      const templates = await this.templateService.findByTagId(parseInt(tagId));

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }

  };

  private validateCreateTemplateData = (body: any) => {
    const { title, description, topic, type, tags, questions, users } = body;
    const result = createTemplateSchema.safeParse({
      title,
      description,
      topic,
      type,
      tags: JSON.parse(tags),
      questions: JSON.parse(questions),
      users: JSON.parse(users),
    });

    if (!result.success) {
      const firstError = result.error.errors[0];
      throw createHttpError(400, firstError.message);
    }

    return result.data;
  };

  private initializeGoogleDrive = () => {
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

    return drive;
  };

  private createFileStream = (buffer: Buffer) => {
    const fileStream = new Readable();
    fileStream.push(buffer);
    fileStream.push(null);
    return fileStream;
  };

  private uploadFileToDrive = async (drive: drive_v3.Drive, file: Express.Multer.File) => {
    const fileStream = this.createFileStream(file.buffer);
    
    const fileMetaData = {
      name: file.originalname,
      mimeType: file.mimetype,
    };

    const media = {
      mimeType: file.mimetype,
      body: fileStream,
      parents: [this.folderId],
    };

    const response = await drive.files.create({
      requestBody: fileMetaData,
      media,
      fields: 'id, webViewLink',
    });

    return response.data.id!;
  };

  private setFilePermissions = async (drive: drive_v3.Drive, fileId: string) => {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const updatedFile = await drive.files.get({
      fileId,
      fields: 'id, webViewLink',
    });

    return updatedFile.data;
  };

  create: RequestHandler = async (req, res, next) => {
    try {
      const data = this.validateCreateTemplateData(req.body);

      const userId = this.validateId(req.params.userId, 'User id');
      const templateId = await this.templateService.create(userId, data);

      const file = req.file;
      if (file) {
        const drive = this.initializeGoogleDrive();
        const fileId = await this.uploadFileToDrive(drive, file);
        const updatedFile = await this.setFilePermissions(drive, fileId);
        await this.templateService.addImage(templateId, updatedFile.id!);
      }

      res.status(200).json({ message: 'Successfully created template' });
    } catch (err) {
      next(err);
    }
  };

  search: RequestHandler = async (req, res, next) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        throw createHttpError(400, 'Query is required to search templates');
      }

      const templates = await this.templateService.search(query);

      res.status(200).json(templates);
    } catch (err) {
      next(err);
    }
  };

  updateDetails: RequestHandler = async (req, res, next) => {
    try {
      const templateId = this.validateId(req.params.templateId, 'Template id');
      
      const result = updateDetailsSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0];
        throw createHttpError(400, firstError.message);
      }

      const isUpdated = await this.templateService.updateDetails(templateId, result.data);
      if (!isUpdated) {
        throw createHttpError(500, `Failed to update template with id ${templateId}. Sorry for the inconvenience. Please try again later.`);
      }

      res.status(200).json({ message: 'Successfully updated template' });
    } catch (err) {
      next(err);
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    try {
      const templateId = this.validateId(req.params.templateId, 'Template id');

      await this.templateService.delete(templateId);

      res.status(200).json({ message: 'Successfully deleted template' });
    } catch (err) {
      next(err);
    }
  };
}

export default new TemplateController();

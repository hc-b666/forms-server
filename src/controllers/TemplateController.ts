import { Request, Response } from 'express';

import TemplateService from '../services/templateService';
import UserService from '../services/userService';

class TemplateController {
  private templateService: TemplateService;
  private userService: UserService;

  constructor() {
    this.templateService = TemplateService.getInstance();
    this.userService = UserService.getInstance();
  }

  getTopTemplates = async (req: Request, res: Response) => {
    try {
      const templates = await this.templateService.getTopTemplates();

      res.status(200).json(templates);
    } catch (err) {
      console.log(`Error in getTopTemplates: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };

  getLatestTemplates = async (req: Request, res: Response) => {
    try {
      const templates = await this.templateService.getLatestTemplates();

      res.status(200).json(templates);
    } catch (err) {
      console.log(`Error in getLatestTemplates: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };

  getTemplateById = async (req: Request, res: Response) => {
    try {
      const { templateId } = req.params;
      if (!templateId) {
        res.status(400).json({ message: 'Template ID is required' });
        return;
      }

      const template = await this.templateService.getTemplateById(
        parseInt(templateId)
      );
      if (!template) {
        res
          .status(404)
          .json({ message: `Template with id ${templateId} not found` });
        return;
      }

      res.status(200).json(template);
    } catch (err) {
      console.log(`Error in getTemplateById: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }

      const templates = await this.templateService.getTemplatesByUserId(parseInt(userId));

      res.status(200).json(templates);
    } catch (err) {
      console.log(`Error in getProfile: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };

  createTemplate = async (req: Request, res: Response) => {
    try {
      const { title, description, topic, type, questions, tags } = req.body;
      if (!title || !description || !topic || questions.length === 0) {
        res.status(400).json({
          message: 'All inputs are required for creating the template',
        });
        return;
      }

      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      await this.templateService.createTemplate({
        title,
        description,
        createdBy: userId,
        topic,
        type,
        questions,
        tags,
      });

      res.status(200).json({ message: 'Successfully created template' });
    } catch (err) {
      console.log(`Error in createTemplate: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };
}

export default TemplateController;

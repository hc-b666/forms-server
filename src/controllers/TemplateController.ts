import { Request, Response } from 'express';

import TemplateService from '../services/templateService';
import UserService from '../services/userService';
import FormService from '../services/formService';
import CommentService from '../services/commentService';

class TemplateController {
  private templateService: TemplateService;
  private userService: UserService;
  private formService: FormService;
  private commentService: CommentService;

  constructor() {
    this.templateService = TemplateService.getInstance();
    this.userService = UserService.getInstance();
    this.formService = FormService.getInstance();
    this.commentService = CommentService.getInstance();
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

      const templates = await this.templateService.getProfile(parseInt(userId));
      const user = await this.userService.getUserById(parseInt(userId));

      res.status(200).json({ templates, user });
    } catch (err) {
      console.log(`Error in getProfile: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };

  getForms = async (req: Request, res: Response) => {
    const templateId = req.templateId;
    if (!templateId) {
      res.status(400).json({ message: 'Template ID is required' });
      return;
    }

    const template = await this.templateService.getTemplateById(templateId);
    const forms = await this.formService.getForms(templateId);

    res.status(200).json({ forms, template });
  };

  getForm = async (req: Request, res: Response) => {
    try {
      const { formId } = req.params;
      if (!formId) {
        res.status(400).json({ message: 'Form ID is required' });
        return;
      }

      const responses = await this.formService.getForm(parseInt(formId));

      res.status(200).json(responses);
    } catch (err) {
      console.log(`Error in getForm: ${err}`);
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

  createForm = async (req: Request, res: Response) => {
    const { templateId } = req.params;
    if (!templateId) {
      res.status(400).json({ message: 'Template ID is required' });
      return;
    }

    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { responses } = req.body;
    if (!responses || responses.length === 0) {
      res.status(400).json({ message: 'Responses are required' });
      return;
    }

    await this.formService.createForm({
      filledBy: userId,
      templateId: parseInt(templateId),
      responses,
    });

    res.status(200).json({ message: 'Successfully submitted!' });
  };

  hasUserSubmittedForm = async (req: Request, res: Response) => {
    try {
      const { templateId } = req.params;
      if (!templateId) {
        res.status(400).json({ message: 'Template ID is required' });
        return;
      }

      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const hasSubmitted = await this.userService.hasUserSubmittedForm(
        userId,
        parseInt(templateId)
      );

      res.status(200).json({ hasSubmitted });
    } catch (err) {
      console.log(`Error in hasUserSubmittedForm: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };

  createComment = async (req: Request, res: Response) => {
    try {
      const { templateId } = req.params;
      if (!templateId) {
        res.status(400).json({ message: 'Template ID is required' });
        return;
      }

      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { content } = req.body;
      if (!content) {
        res.status(400).json({ message: 'Content is required' });
        return;
      }

      await this.commentService.createComment(
        userId,
        parseInt(templateId),
        content
      );

      res.status(200).json({ message: 'Successfully created comment' });
    } catch (err) {
      console.log(`Error in createComment: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };
}

export default TemplateController;

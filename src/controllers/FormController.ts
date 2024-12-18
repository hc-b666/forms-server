import { Request, Response } from 'express';
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
}

export default FormController;

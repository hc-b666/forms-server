import { RequestHandler } from 'express';
import TemplateService from '../services/templateService';

export const isAuthorMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { templateId } = req.params;
    if (!templateId || isNaN(parseInt(templateId))) {
      res.status(400).json({ message: 'Template ID is required' });
      return;
    }

    const isAuthor = await new TemplateService().checkIfUserIsAuthorOFTemplate(userId, parseInt(templateId));
    if (!isAuthor) {
      res.status(403).json({ message: 'Action not allowed' });
      return;
    }

    req.templateId = parseInt(templateId);

    next();
  } catch (err) {
    res.status(500).json({ message: 'Internal server err' });
  }
};

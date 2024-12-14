import { RequestHandler } from 'express';
import { checkIfUserIsAuthorOfTemplateQuery } from '../models/queries/formQuery';

export const isAuthorMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const { templateId } = req.params;
    if (!templateId || isNaN(parseInt(templateId))) {
      res.status(400).json({ message: 'Template ID is required' });
      return;
    }

    const isAuthor = await checkIfUserIsAuthorOfTemplateQuery(parseInt(req.params.templateId), userId);
    if (!isAuthor) {
      res.status(401).json({ message: 'Action not allowed' });
      return;
    }

    req.templateId = parseInt(templateId);

    next();
  } catch (err) {
    res.status(500).json({ message: 'Internal server err' });
  }
};

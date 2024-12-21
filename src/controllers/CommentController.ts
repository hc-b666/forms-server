import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import CommentService from '../services/commentService';

class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = CommentService.getInstance();
  }

  createComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { templateId } = req.params;
      if (!templateId) {
        throw createHttpError(400, 'Template Id is required');
      }

      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }

      const { content } = req.body;
      if (!content) {
        throw createHttpError(400, 'Content is required to comment');
      }

      await this.commentService.createComment(parseInt(templateId), userId, content);

      res.status(200).json({ message: 'Successfully created comment' });
    } catch (err) {
      next(err);
    }
  };
}

export default CommentController;

import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

import CommentService from './comment.service';
import { commentSchema } from './dto/comment.dto';

class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = CommentService.getInstance();
  }

  private validateId = (id: string): number => {
    if (!id || isNaN(parseInt(id))) {
      throw createHttpError(400, 'Template Id is required');
    }

    return parseInt(id);
  };

  findComments: RequestHandler = async (req, res, next) => {
    try {
      const templateId = this.validateId(req.params.templateId);

      const comments = await this.commentService.findComments(templateId);

      res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  };

  create: RequestHandler = async (req, res, next) => {
    try {
      const templateId = this.validateId(req.params.templateId);

      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }

      const result = commentSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0];
        throw createHttpError(400, firstError.message);
      }

      await this.commentService.create(templateId, userId, result.data.content);

      res.status(200).json({ message: 'Successfully created comment' });
    } catch (err) {
      next(err);
    }
  };
}

export default new CommentController();

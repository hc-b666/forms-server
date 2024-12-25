import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

import LikeService from '../services/likeService';

class LikeController {
  private likeService: LikeService;

  constructor() {
    this.likeService = LikeService.getInstance();
  }

  getTemplateLikes: RequestHandler = async (req, res, next) => {
    try {
      const templateId = parseInt(req.params.templateId);
      if (isNaN(templateId)) {
        throw createHttpError(400, 'Invalid template id');
      }

      const userId = req.user?.id;
      if (userId) {
        const likeInfo = await this.likeService.getTemplateLikes(userId, templateId);
        res.json(likeInfo);
      } else {
        const likeCount = await this.likeService.getLikeCount(templateId);
        res.json({ isLiked: false, likeCount });
      }
    } catch (err) {
      next(err);
    }
  };

  toggleTemplateLike: RequestHandler = async (req, res, next) => {
    try {
      const templateId = parseInt(req.params.templateId);
      if (isNaN(templateId)) {
        throw createHttpError(400, 'Invalid template id');
      }

      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }

      const isLiked = await this.likeService.toggleLikeTemplate(userId, templateId);

      res.json({ message: isLiked ? 'Template liked' : 'Template unliked' });
    } catch (err) {
      next(err);
    }
  };
}

export default new LikeController();

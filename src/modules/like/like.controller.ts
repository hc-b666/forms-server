import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

import LikeService from './like.service';

class LikeController {
  private likeService: LikeService;

  constructor() {
    this.likeService = LikeService.getInstance();
  }

  private validateId = (id: string): number => {
    if (!id || isNaN(parseInt(id))) {
      throw createHttpError(400, 'Invalid templateId');
    }

    return parseInt(id);
  };

  findLikes: RequestHandler = async (req, res, next) => {
    try {
      const templateId = this.validateId(req.params.templateId);

      const userId = req.user?.id;
      if (userId) {
        const likeInfo = await this.likeService.findLikes(userId, templateId);
        res.json(likeInfo);
      } else {
        const likeCount = await this.likeService.getLikeCount(templateId);
        res.json({ isLiked: false, likeCount });
      }
    } catch (err) {
      next(err);
    }
  };

  toggleLike: RequestHandler = async (req, res, next) => {
    try {
      const templateId = this.validateId(req.params.templateId);

      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }

      const isLiked = await this.likeService.toggleLike(userId, templateId);

      res.json({ message: isLiked ? 'Template liked' : 'Template unliked' });
    } catch (err) {
      next(err);
    }
  };
}

export default new LikeController();

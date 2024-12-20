import { NextFunction, Request, Response } from 'express';

import TagService from '../services/tagService';
import createHttpError from 'http-errors';

class TagController {
  private tagService: TagService;

  constructor() {
    this.tagService = TagService.getInstance();
  }

  getTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await this.tagService.getTags();

      res.status(200).json(tags);
    } catch (err) {
      next(err);
    }
  };

  searchTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        throw createHttpError(400, 'Query is required to search tags');
      }

      const tags = await this.tagService.searchTags(query);

      res.status(200).json(tags);
    } catch (err) {
      next(err);
    }
  };
}

export default TagController;

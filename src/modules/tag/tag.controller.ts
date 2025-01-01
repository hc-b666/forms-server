import { NextFunction, Request, RequestHandler, Response } from 'express';

import TagService from './tag.service';
import createHttpError from 'http-errors';

class TagController {
  private tagService: TagService;

  constructor() {
    this.tagService = TagService.getInstance();
  }

  findTags: RequestHandler = async (req, res, next) => {
    try {
      const tags = await this.tagService.findTags();

      res.status(200).json(tags);
    } catch (err) {
      next(err);
    }
  };

  searchTags: RequestHandler = async (req, res, next) => {
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

export default new TagController();

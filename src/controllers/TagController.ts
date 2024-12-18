import { Request, Response } from 'express';
import TagService from '../services/tagService';

class TagController {
  private tagService: TagService;

  constructor() {
    this.tagService = new TagService();
  }

  getTags = async (req: Request, res: Response) => {
    try {
      const tags = await this.tagService.getTags();

      res.status(200).json(tags);
    } catch (err) {
      console.log(`Error in getTags: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };

  searchTags = async (req: Request, res: Response) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        res.status(400).json({ message: 'Invalid query' });
        return;
      }

      const tags = await this.tagService.searchTags(query);

      res.status(200).json(tags);
    } catch (err) {
      console.log(`Error in searchTags: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };
}

export default TagController;

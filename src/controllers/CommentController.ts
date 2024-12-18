import { Request, Response } from 'express';
import CommentService from '../services/commentService';

class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = CommentService.getInstance();
  }

  createComment = async (req: Request, res: Response) => {
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

      const { content } = req.body;
      if (!content) {
        res.status(400).json({ message: 'Content is required' });
        return;
      }

      await this.commentService.createComment(
        userId,
        parseInt(templateId),
        content
      );

      res.status(200).json({ message: 'Successfully created comment' });
    } catch (err) {
      console.log(`Error in createComment: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };
}

export default CommentController;

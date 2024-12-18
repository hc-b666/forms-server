import express from 'express';
import TagController from '../controllers/TagController';

const router = express.Router();
const tagController = new TagController();

router.get('/', tagController.getTags);
router.get('/search', tagController.searchTags);

export default router;

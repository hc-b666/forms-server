import express from 'express';

import { authRoutes } from './modules/auth';
import { templateRoutes } from './modules/template';
import { formRoutes } from './modules/form';
import { commentRoutes } from './modules/comment';
import { tagRoutes } from './modules/tag';
import { userRoutes } from './modules/user';
import { adminRoutes } from './modules/admin';
import { likeRoutes } from './modules/like';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/templates', templateRoutes);
router.use('/forms', formRoutes);
router.use('/comments', commentRoutes);
router.use('/tags', tagRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/likes', likeRoutes);

export default router;

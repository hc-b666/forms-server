import express from 'express';

import authRoutes from './authRoutes';
import templateRoutes from './templateRoutes';
import formRoutes from './formRoutes';
import commentRoutes from './commentRoutes';
import tagRoutes from './tagRoutes';
import userRoutes from './userRoutes';
import adminRoutes from './adminRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/templates', templateRoutes);
router.use('/forms', formRoutes);
router.use('/comments', commentRoutes);
router.use('/tags', tagRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

export default router;

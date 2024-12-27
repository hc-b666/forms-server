import express from 'express';

import AuthMiddleware from '../middlewares/AuthMiddleware';
import UserController from '../controllers/userController';
import AdminController from '../controllers/adminController';

const router = express.Router();
const authMiddleware = new AuthMiddleware();
const userController = new UserController();

router.get('/users', authMiddleware.authenticate, authMiddleware.isAdmin, userController.getUsers);

router.put('/block/:userId([0-9]+)', authMiddleware.authenticate, authMiddleware.isAdmin, AdminController.blockUser);
router.put('/unblock/:userId([0-9]+)', authMiddleware.authenticate, authMiddleware.isAdmin, AdminController.unblockUser);
router.put('/promote/:userId([0-9]+)', authMiddleware.authenticate, authMiddleware.isAdmin, AdminController.promoteToAdmin);
router.put('/demote/:userId([0-9]+)', authMiddleware.authenticate, authMiddleware.isAdmin, AdminController.demoteToUser);

router.delete('/users/:userId([0-9]+)', authMiddleware.authenticate, authMiddleware.isAdmin, AdminController.deleteUser);

export default router;

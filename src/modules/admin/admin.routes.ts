import { Router } from 'express';
import AuthMiddleware from '../../middlewares/authMIddleware.controller';
import adminController from './admin.controller';

const router = Router();

router.get('/users', AuthMiddleware.authenticate, AuthMiddleware.isAdmin, adminController.findUsers);

router.put('/block/:userId([0-9]+)', AuthMiddleware.authenticate, AuthMiddleware.isAdmin, adminController.block);
router.put('/unblock/:userId([0-9]+)', AuthMiddleware.authenticate, AuthMiddleware.isAdmin, adminController.unblock);
router.put('/promote/:userId([0-9]+)', AuthMiddleware.authenticate, AuthMiddleware.isAdmin, adminController.promote);
router.put('/demote/:userId([0-9]+)', AuthMiddleware.authenticate, AuthMiddleware.isAdmin, adminController.demote);

router.delete('/users/:userId([0-9]+)', AuthMiddleware.authenticate, AuthMiddleware.isAdmin, adminController.delete);

export default router;

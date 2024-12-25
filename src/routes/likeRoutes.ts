import express, { RequestHandler } from 'express';
import LikeController from '../controllers/likeController';
import TokenService from '../utils/jwt';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = express.Router();
const authMiddleware = new AuthMiddleware();

const addUserToRequest: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = TokenService.extractTokenFromHeader(authHeader);
      const decoded = TokenService.verifyToken(token);

      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch (err) {
    next(err);
  }
};

router.get('/:templateId([0-9]+)', addUserToRequest, LikeController.getTemplateLikes);

router.post('/:templateId([0-9]+)', authMiddleware.authenticate, LikeController.toggleTemplateLike);

export default router;

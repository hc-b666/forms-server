import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

import TokenService from '../utils/jwt';
import UserService from '../services/userService';

class AuthMiddleware {
  private userService: UserService;
  
  constructor() {
    this.userService = UserService.getInstance();
  }

  authenticate: RequestHandler = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw createHttpError(401, 'Authorization header is required');
      }

      const token = TokenService.extractTokenFromHeader(authHeader);
      const decoded = TokenService.verifyToken(token);

      req.userId = decoded.userId;
      
      next();
    } catch (err) {
      next(err);
    }
  };

  isAuthor: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }
  
      const { templateId } = req.params;
      if (!templateId || isNaN(parseInt(templateId))) {
        throw createHttpError(400, 'Template Id is required');
      }
  
      const isAuthor = await this.userService.checkIfUserIsAuthorOFTemplate(userId, parseInt(templateId));
      if (!isAuthor) {
        throw createHttpError(403, 'Action is not allowed');
      }
  
      req.templateId = parseInt(templateId);
  
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default AuthMiddleware;

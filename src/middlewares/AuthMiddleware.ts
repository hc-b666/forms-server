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

      const exists = await this.userService.checkUserExists(decoded.email);
      if (!exists) {
        throw createHttpError(401, 'Unauthorized');
      }

      req.user = { 
        id: decoded.userId, 
        email: decoded.email, 
        role: decoded.role 
      };
      
      next();
    } catch (err) {
      next(err);
    }
  };

  isAuthor: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }
  
      const { templateId } = req.params;
      if (!templateId || isNaN(parseInt(templateId))) {
        throw createHttpError(400, 'Template Id is required');
      }
  
      const isAuthorOfTemplate = await this.userService.checkIfUserIsAuthorOFTemplate(userId, parseInt(templateId));
      const isAuthorOfForm = await this.userService.checkIfUserIsAuthorOfForm(userId, parseInt(templateId));
      if (!isAuthorOfTemplate && !isAuthorOfForm) {
        throw createHttpError(403, 'Forbidden - You are not allowed');
      }
  
      req.templateId = parseInt(templateId);
  
      next();
    } catch (err) {
      next(err);
    }
  };

  isFormAuthor: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }
  
      const { formId } = req.params;
      if (!formId || isNaN(parseInt(formId))) {
        throw createHttpError(400, 'Form Id is required');
      }
  
      const isAuthorOfForm = await this.userService.checkIfUserIsAuthorOfForm(userId, parseInt(formId));
      if (!isAuthorOfForm) {
        throw createHttpError(403, 'Forbidden - You are not allowed');
      }
  
      next();
    } catch (err) {
      next(err);
    }
  };

  isAdmin: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user) {
        throw createHttpError(401, 'Unauthorized');
      }

      if (req.user.role !== 'ADMIN') {
        throw createHttpError(403, 'Forbidden - You are not allowed');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

export default AuthMiddleware;

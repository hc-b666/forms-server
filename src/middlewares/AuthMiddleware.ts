import { RequestHandler } from 'express';
import { UserRole } from '@prisma/client';
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

      const user = await this.userService.checkUserExists(decoded.email);
      if (!user) {
        throw createHttpError(401, 'Unauthorized');
      }

      if (user.isBlocked) {
        throw createHttpError(401, 'You are blocked. Ask from our customer services to unblock you.');
      }

      if (decoded.role === "ADMIN" && user.role === "USER") {
        throw createHttpError(403, 'Forbidden');
      }

      req.user = { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      };
      
      next();
    } catch (err) {
      next(err);
    }
  };

  isAuthor: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        throw createHttpError(401, 'Unauthorized');
      }
  
      const { templateId } = req.params;
      if (!templateId || isNaN(parseInt(templateId))) {
        throw createHttpError(400, 'Template Id is required');
      }

      const { formId } = req.params;
      if (!formId || isNaN(parseInt(formId))) {
        throw createHttpError(400, 'Form Id is required');
      }
  
      const isAuthorOfTemplate = await this.userService.checkIfUserIsAuthorOFTemplate(user.id, parseInt(templateId));
      const isAuthorOfForm = await this.userService.checkIfUserIsAuthorOfForm(user.id, parseInt(formId));
      if (!isAuthorOfTemplate && !isAuthorOfForm && user.role !== UserRole.ADMIN) {
        throw createHttpError(403, 'Forbidden - You are not allowed');
      }
  
      req.templateId = parseInt(templateId);
  
      next();
    } catch (err) {
      next(err);
    }
  };

  isTemplateAuthor: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        throw createHttpError(401, 'Unauthorized');
      }
  
      const { templateId } = req.params;
      if (!templateId || isNaN(parseInt(templateId))) {
        throw createHttpError(400, 'Template Id is required');
      }
  
      const isAuthorOfTemplate = await this.userService.checkIfUserIsAuthorOFTemplate(user.id, parseInt(templateId));
      if (!isAuthorOfTemplate && user.role !== UserRole.ADMIN) {
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

      if (req.user.role !== UserRole.ADMIN) {
        throw createHttpError(403, 'Forbidden - You are not allowed');
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

export default AuthMiddleware;

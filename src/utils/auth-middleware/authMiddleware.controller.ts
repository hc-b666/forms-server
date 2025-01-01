import { RequestHandler } from 'express';
import { UserRole } from '@prisma/client';
import createHttpError from 'http-errors';

import TokenService, { ITokenPayload } from '../jwt';
import AuthMiddlewareService from './authMiddlware.service';

class AuthMiddlewareController {
  private authMiddlewareService: AuthMiddlewareService;
  
  constructor() {
    this.authMiddlewareService = AuthMiddlewareService.getInstance();
  }

  private validateAuthHeader = (authHeader: string | undefined) => {
    if (!authHeader) {
      throw createHttpError(401, 'Authorization header is required');
    }

    const token = TokenService.extractTokenFromHeader(authHeader);
    const decoded = TokenService.verifyToken(token);

    return decoded;
  };

  private checkUser = async (decoded: ITokenPayload) => {
    const user = await this.authMiddlewareService.findUserByEmail(decoded.email);
    if (!user) {
      throw createHttpError(401, 'Unauthorized');
    }

    if (user.isBlocked) {
      throw createHttpError(401, 'You are blocked. Ask from our customer services to unblock you.');
    }

    if (decoded.role === "ADMIN" && user.role === "USER") {
      throw createHttpError(403, 'Forbidden');
    }

    return user;
  };

  addUserToRequest: RequestHandler = async (req, _res, next) => {
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

  authenticate: RequestHandler = async (req, _res, next) => {
    try {
      const decoded = this.validateAuthHeader(req.headers.authorization);

      const user = await this.checkUser(decoded);

      req.user = { 
        id: user.id, 
        email: user.email, 
        role: user.role,
      };
      
      next();
    } catch (err) {
      next(err);
    }
  };

  private validateId = (id: string | undefined, paramName: string) => {
    if (!id || isNaN(parseInt(id))) {
      throw createHttpError(400, `${paramName} is required`);
    }

    return parseInt(id);
  };

  isAuthor: RequestHandler = async (req, _res, next) => {
    try {
      const user = req.user;
      if (!user) {
        throw createHttpError(401, 'Unauthorized');
      }
  
      const templateId = this.validateId(req.params.templateId, 'Template Id');
      const formId = this.validateId(req.params.formId, 'Form Id');
  
      const isAuthorOfTemplate = await this.authMiddlewareService.isAuthorOfTemplate(user.id, templateId);
      const isAuthorOfForm = await this.authMiddlewareService.isAuthorOfForm(user.id, formId);
      if (!isAuthorOfTemplate && !isAuthorOfForm && user.role !== UserRole.ADMIN) {
        throw createHttpError(403, 'Forbidden - You are not allowed');
      }
  
      req.templateId = templateId;
  
      next();
    } catch (err) {
      next(err);
    }
  };

  isTemplateAuthor: RequestHandler = async (req, _res, next) => {
    try {
      const user = req.user;
      if (!user) {
        throw createHttpError(401, 'Unauthorized');
      }
  
      const templateId = this.validateId(req.params.templateId, 'Template Id');
  
      const isAuthorOfTemplate = await this.authMiddlewareService.isAuthorOfTemplate(user.id, templateId);
      if (!isAuthorOfTemplate && user.role !== UserRole.ADMIN) {
        throw createHttpError(403, 'Forbidden - You are not allowed');
      }

      req.templateId = templateId;
      next();
    } catch (err) {
      next(err);
    }
  };

  isFormAuthor: RequestHandler = async (req, _res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(401, 'Unauthorized');
      }
  
      const formId = this.validateId(req.params.formId, 'Form Id');
  
      const isAuthorOfForm = await this.authMiddlewareService.isAuthorOfForm(userId, formId);
      if (!isAuthorOfForm && req.user?.role !== UserRole.ADMIN) {
        throw createHttpError(403, 'Forbidden - You are not allowed');
      }
  
      next();
    } catch (err) {
      next(err);
    }
  };

  isAdmin: RequestHandler = async (req, _res, next) => {
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

export default new AuthMiddlewareController();

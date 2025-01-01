import { RequestHandler } from 'express';
import AdminService from './admin.service';
import createHttpError from 'http-errors';

class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = AdminService.getInstance();
  }

  private validateUserId = (userId: string | undefined) => {
    if (!userId || isNaN(parseInt(userId))) {
      throw createHttpError(400, 'UserId is required');
    }

    return parseInt(userId);
  };

  findUsers: RequestHandler = async (_req, res, next) => {
    try {
      const users = await this.adminService.findUsers();

      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };

  block: RequestHandler = async (req, res, next) => {
    try {
      const userId = this.validateUserId(req.params.userId);

      const result = await this.adminService.block(userId);
      if (!result) {
        throw createHttpError(404, `User with ${userId} is not found`);
      }

      res.status(200).json({ message: 'Successfully blocked user' });
    } catch (err) {
      next(err);
    }
  };

  unblock: RequestHandler = async (req, res, next) => {
    try {
      const userId = this.validateUserId(req.params.userId);

      const result = await this.adminService.unblock(userId);
      if (!result) {
        throw createHttpError(404, `User with ${userId} is not found`);
      }

      res.status(200).json({ message: 'Succesfully unblocked user' });
    } catch (err) {
      next(err);
    }
  };

  promote: RequestHandler = async (req, res, next) => {
    try {
      const userId = this.validateUserId(req.params.userId);

      const result = await this.adminService.promote(userId);
      if (!result) {
        throw createHttpError(404, `User with ${userId} is not found`);
      }

      res.status(200).json({ message: 'Succesfully promoted to admin' });
    } catch (err) {
      next(err);
    }
  };

  demote: RequestHandler = async (req, res, next) => {
    try {
      const userId = this.validateUserId(req.params.userId);

      const result = await this.adminService.demote(userId);
      if (!result) {
        throw createHttpError(404, `User with ${userId} is not found`);
      }

      res.status(200).json({ message: 'Successfully demoted to user' });
    } catch (err) {
      next(err);
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    try {
      const userId = this.validateUserId(req.params.userId);

      const result = await this.adminService.delete(userId);
      if (!result) {
        throw createHttpError(404, `User with ${userId} is not found`);
      }

      res.status(200).json({ message: 'Successfully deleted user' });
    } catch (err) {
      next(err);
    }
  };
}

export default new AdminController();

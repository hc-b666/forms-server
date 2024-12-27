import { RequestHandler } from "express";
import AdminService from "../services/adminService";
import createHttpError from "http-errors";

class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = AdminService.getInstance();
  }

  blockUser: RequestHandler = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'UserId is required');
      }

      const result = await this.adminService.blockUser(parseInt(userId));
      if (!result) {
        throw createHttpError(404, `User with ${userId} is not found`);
      }

      res.status(200).json({ message: 'Successfully blocked user' });
    } catch (err) {
      next(err);
    }
  };

  unblockUser: RequestHandler = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'UserId is required');
      }

      const result = await this.adminService.unblockUser(parseInt(userId));
      if (!result) {
        throw createHttpError(404, `User with ${userId} is not found`);
      }

      res.status(200).json({ message: 'Succesfully unblocked user' });
    } catch (err) {
      next(err);
    }
  };
  
  promoteToAdmin: RequestHandler = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'UserId is required');
      }

      const result = await this.adminService.promoteToAdmin(parseInt(userId));
      if (!result) {
        throw createHttpError(404, `User with ${userId} is not found`);
      }

      res.status(200).json({ message: 'Succesfully promoted to admin' });
    } catch (err) {
      next(err);
    }
  };
  
  demoteToUser: RequestHandler = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'UserId is required');
      }

      const result = await this.adminService.demoteToUser(parseInt(userId));
      if (!result) {
        throw createHttpError(404, `User with ${userId} is not found`);
      }

      res.status(200).json({ message: 'Successfully demoted to user' });
    } catch (err) {
      next(err);
    }
  };
  
  deleteUser: RequestHandler = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'UserId is required');
      }

      const result = await this.adminService.deleteUser(parseInt(userId));
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

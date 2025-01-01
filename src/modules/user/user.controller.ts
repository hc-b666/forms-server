import { type RequestHandler } from 'express';
import createHttpError from 'http-errors';
import UserService from './user.service';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = UserService.getInstance();
  }

  findById: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      if (!userId || isNaN(parseInt(userId))) {
        throw createHttpError('User Id is required');
      }

      const user = await this.userService.findById(parseInt(userId));
      if (!user) {
        throw createHttpError('There is no user with this id');
      }

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  searchByEmail: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        throw createHttpError(401, 'Unauthorized');
      }

      const { query } = req.query as { query: string };
      const users = await this.userService.searchByEmaiL(query, user.id);
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };
}

export default new UserController();

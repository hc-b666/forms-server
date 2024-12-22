import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

import UserService from '../services/userService';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = UserService.getInstance();
  }

  getUserById: RequestHandler = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'User Id is required');
      }

      const user = await this.userService.getUserById(parseInt(userId));
      if (user === null) {
        throw createHttpError(400, 'There is no user with this id');
      }

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  getUsers: RequestHandler = async (req, res, next) => {
    try {
      const users = await this.userService.getUsers();

      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };
}

export default UserController;

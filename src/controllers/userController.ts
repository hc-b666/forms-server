import { NextFunction, Request, Response } from 'express';
import UserService from '../services/userService';

import createHttpError from 'http-errors';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = UserService.getInstance();
  }

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw createHttpError(400, 'User Id is required');
      }

      const user = await this.userService.getUserById(parseInt(userId));

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };
}

export default UserController;

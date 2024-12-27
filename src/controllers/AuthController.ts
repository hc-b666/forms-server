import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import UserService from '../services/userService';
import TokenService from '../utils/jwt';
import { validateInput } from '../utils/validateInput';

class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = UserService.getInstance();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, username, email, password } = req.body;
      validateInput(req.body, ['firstName', 'lastName', 'username', 'email', 'password']);

      const userExists = await this.userService.checkUserExists(email);
      if (userExists) {
        throw createHttpError(409, `User already exists with this email. Please login.`);
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await this.userService.createUser({ firstName, lastName, username, email, passwordHash });

      res.status(200).json({ message: 'Successfully registered!' });
    } catch (err) {
      next(err);
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      validateInput(req.body, ['email', 'password']);

      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw createHttpError(400, `There is no user with this email`);
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw createHttpError(400, `Invalid credentials`);
      }

      if (user.isBlocked) {
        throw createHttpError(401, 'You are blocked. Ask from our customer services to unblock you.');
      }

      const accessToken = TokenService.createAccessToken(user.id, user.email, user.role);
      const refreshToken = TokenService.createRefreshToken(user.id, user.email, user.role);

      const response = {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        message: 'Successfully logged in!',
      }

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createHttpError(401, `Invalid token`);
      }

      const decoded = TokenService.verifyToken(refreshToken);

      const user = await this.userService.checkUserExists(decoded.email);
      if (!user) {
        throw createHttpError(401, 'Unauthorized');
      }

      if (user.isBlocked) {
        throw createHttpError(401, 'You are blocked. Ask from our customer services to unblock you.');
      }

      const newAccessToken = TokenService.createAccessToken(decoded.userId, decoded.email, decoded.role);

      res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;

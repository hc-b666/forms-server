import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import UserService from '../services/userService';
import TokenService from '../utils/jwt';

class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  register = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, username, email, password } = req.body;
      if (!firstName || !lastName || !username || !email || !password) {
        res.status(400).json({ message: 'All inputs are required for registration' });
        return;
      }

      const userExists = await this.userService.checkUserExists(email);
      if (userExists) {
        res.status(409).json({ message: 'User already exists with this email. Please login' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await this.userService.createUser({ firstName, lastName, username, email, passwordHash });

      res.status(200).json({ message: 'Successfully registered!' });
    } catch (err) {
      console.log(`Error at register: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'All inputs are required for logging in' });
        return;
      }

      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(400).json({ message: 'Wrong password' });
        return;
      }

      const accessToken = TokenService.createAccessToken(user.id, user.email);
      const refreshToken = TokenService.createRefreshToken(user.id, user.email);

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
      console.log(`Error at login: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  }

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const decoded = TokenService.verifyToken(refreshToken);

      const newAccessToken = TokenService.createAccessToken(decoded.userId, decoded.email);

      res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      console.log(`Error at refreshToken: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  }
}

export default AuthController;

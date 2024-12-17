import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

import { createUserQuery, getUserQuery, userExistsQuery } from '../models/queries/userQuery';
import TokenService from '../utils/jwt';

interface IRegisterBody {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export const register: RequestHandler<unknown, unknown, IRegisterBody, unknown> = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    if (!firstName || !lastName || !username || !email || !password) {
      res.status(400).json({ message: 'All inputs are required for registration' });
      return;
    }

    const users = await userExistsQuery(username, email);
    if (users.length > 0) {
      res.status(409).json({ message: 'User already exists with this email or username. Please login' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    await createUserQuery(firstName, lastName, username, email, passwordHash, 'user');

    res.status(200).json({ message: 'Successfully registered!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};

interface ILoginBody {
  email: string;
  password: string;
}

export const login: RequestHandler<unknown, unknown, ILoginBody, unknown> = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'All inputs are required for logging in' });
      return;
    }

    const userResult = await getUserQuery(email);
    if (userResult.rows.length === 0) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid credentials' });
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
};

export const refreshToken: RequestHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: 'No refresh token provided' });
      return;
    }

    const decoded = TokenService.verifyToken(refreshToken);

    const newAccessToken = TokenService.createAccessToken(decoded.userId, decoded.email);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.log(`Error at refreshToken: ${err}`);
    res.status(500).json({ message: 'Internal server err' });
  }
};

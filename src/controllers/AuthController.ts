import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

import pool from '../models/postgresDb';
import { createUser, getUserQuery, userExists } from '../models/queries/userQuery';
import { createSecretToken, verifySecretToken } from '../utils/jwt';

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

    const exists = await pool.query(userExists, [username, email]);
    if (exists.rows.length > 0) {
      res.status(409).json({ message: 'User already exists with this email or username. Please login' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = { firstName, lastName, username, email, passwordHash, role: 'user' };
    const values = [newUser.firstName, newUser.lastName, newUser.username, newUser.email, newUser.passwordHash, newUser.role];
    
    await pool.query(createUser, values); 

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

    const user = await pool.query(getUserQuery, [email]);
    if (user.rows.length === 0 || !(await bcrypt.compare(password, user.rows[0].passwordHash))) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const u = user.rows[0] as IUser;

    const token = createSecretToken(u.id, u.email);
    const ures = {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      username: u.username,
      email: u.email,
      role: u.role,  
    };

    res.status(200).json({ token, user: ures, message: 'Successfully logged in!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};

interface IValidateToken {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export const validateToken: RequestHandler<unknown, unknown, IValidateToken, unknown> = async (req, res) => {
  try {
    const { token, user } = req.body;
    if (!token || !user) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = verifySecretToken(token);
    if (decoded.userId !== user.id || decoded.email !== user.email) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const u = await pool.query(getUserQuery, [decoded.email]);
    if (u.rows.length === 0) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const us = u.rows[0] as IUser;
    if (us.id !== user.id || us.email !== user.email || us.role !== user.role) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const tkn = createSecretToken(us.id, us.email);
    const ures = {
      id: us.id,
      firstName: us.firstName,
      lastName: us.lastName,
      username: us.username,
      email: us.email,
      role: us.role,  
    };

    res.status(200).json({ token: tkn, user: ures });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};

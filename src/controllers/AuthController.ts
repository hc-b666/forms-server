import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

import UserModel, { UserRole } from '../models/UserModel';
import { createSecretToken, verifySecretToken } from '../utils/jwt';
import { Types } from 'mongoose';

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

    const exists = await UserModel.findOne({ email });
    if (exists) {
      res.status(409).json({ message: 'User already exists with this email. Please login' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = new UserModel({
      firstName,
      lastName,
      username,
      email,
      passwordHash,
      role: UserRole.USER, 
    });

    await newUser.save();

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

    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = createSecretToken(user._id, user.email);
    const ures = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,  
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
    id: Types.ObjectId;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
  }
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

    const u = await UserModel.findOne({ email: decoded.email });
    if (!u) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    if (u.email !== user.email || u._id !== user.id || u.role !== user.role) {
      res.status(403).json({ message: 'Unauhorized' });
      return;
    }
    
    const tkn = createSecretToken(u._id, u.email);
    const ures = {
      id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      username: u.username,
      email: u.email,
      role: u.role,  
    };

    res.status(200).json({ token, user: ures });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server err' });
  }
};

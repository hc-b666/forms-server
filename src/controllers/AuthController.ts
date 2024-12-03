import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

import UserModel, { UserRole } from '../models/UserModel';
import { createSecretToken } from '../utils/jwt';

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

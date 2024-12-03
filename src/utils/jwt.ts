import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

dotenv.config();

export const createSecretToken = (userId: Types.ObjectId, email: string) => {
  const token_key = process.env.TOKEN_KEY;
  if (!token_key) {
    throw new Error('TOKEN_KEY is not defined in .env file');
  }

  return jwt.sign({ userId, email }, token_key, {
    expiresIn: 60 * 60,
  });
};

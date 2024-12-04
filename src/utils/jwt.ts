import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
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

interface JwtPayloadExtended extends JwtPayload {
  userId: Types.ObjectId;
  email: string;
  exp: number;
}

export const verifySecretToken = (token: string) => {
  const token_key = process.env.TOKEN_KEY;
  if (!token_key) {
    throw new Error('TOKEN_KEY is not defined in .env file');
  }

  const decoded = jwt.verify(token, token_key) as JwtPayloadExtended;
  if (!decoded.exp || Date.now() >= decoded.exp * 1000) {
    throw new Error('Token expired');
  }

  return decoded;
}

export const verifySecretTokenFromHeader = (authHeader: string) => {
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Unauthorized');
  }

  return verifySecretToken(token);
};

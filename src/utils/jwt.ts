import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { UserRole } from '@prisma/client';

dotenv.config();

interface ITokenPayload extends JwtPayload {
  userId: number;
  email: string;
  exp: number;
  role: UserRole;
}

class TokenService {
  private static getTokenKey(): string {
    const token_key = process.env.TOKEN_KEY;
    if (!token_key) {
      throw createHttpError(500, 'Internal server error');
    }

    return token_key;
  }

  private static createToken(userId: number, email: string, role: UserRole, amount: number) {
    return jwt.sign({ userId, email, role }, this.getTokenKey(), { expiresIn: amount });
  }

  static createAccessToken(userId: number, email: string, role: UserRole) {
    return this.createToken(userId, email, role, 60 * 60 * 24);
  }

  static createRefreshToken(userId: number, email: string, role: UserRole) {
    return this.createToken(userId, email, role, 60 * 60 * 24 * 7);
  }

  static verifyToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, this.getTokenKey()) as ITokenPayload;
    } catch (err) {
      throw createHttpError(401, 'Unauthorized');
    }
  }

  static extractTokenFromHeader(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Invalid authorization header');
    }

    return authHeader.split(' ')[1];
  }
}

export default TokenService;

import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotenv.config();

interface ITokenPayload extends JwtPayload {
  userId: number;
  email: string;
  exp: number;
}

class TokenService {
  private static getTokenKey(): string {
    const token_key = process.env.TOKEN_KEY;
    if (!token_key) {
      throw new Error('TOKEN_KEY is not defined in .env file');
    }

    return token_key;
  }

  static createAccessToken(userId: number, email: string) {
    return jwt.sign({ userId, email }, this.getTokenKey(), { expiresIn: 60 * 60 });
  }

  static createRefreshToken(userId: number, email: string) {
    return jwt.sign({ userId, email }, this.getTokenKey(), { expiresIn: 60 * 60 * 24 * 7 });
  }

  static verifyToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, this.getTokenKey()) as ITokenPayload;
    } catch (err) {
      console.log(`Error at verifyToken: ${err}`);
      throw new Error('Invalid or expired token');
    }
  }

  static extractTokenFromHeader(authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header');
    }

    return authHeader.split(' ')[1];
  }
}

export default TokenService;

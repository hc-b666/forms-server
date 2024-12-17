import { RequestHandler } from 'express';
import TokenService from '../utils/jwt';
import { getErrorMessage } from '../utils/getErrorMessage';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'No authorization header' });
      return;
    }

    const token = TokenService.extractTokenFromHeader(authHeader);
    const decoded = TokenService.verifyToken(token);

    req.userId = decoded.userId;
    
    next();
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(401).json({ message });
  }
};

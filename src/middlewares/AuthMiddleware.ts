import { RequestHandler } from 'express';
import { verifySecretTokenFromHeader } from '../utils/jwt';
import { getErrorMessage } from '../utils/getErrorMessage';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const decoded = verifySecretTokenFromHeader(authHeader);

    req.userId = decoded.userId;
    
    next();
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(403).json({ message });
  }
};

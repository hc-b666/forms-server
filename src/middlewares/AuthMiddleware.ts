import { RequestHandler } from 'express';
import { verifySecretToken } from '../utils/jwt';
import { getErrorMessage } from '../utils/getErrorMessage';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(403).json({ message: 'Unauthorized' });
    return;
  }

  try {
    verifySecretToken(authHeader);
    
    next();
  } catch (err) {
    const message = getErrorMessage(err);
    res.status(403).json({ message });
  }
};

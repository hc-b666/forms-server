import { RequestHandler } from 'express';
import TokenService from '../utils/jwt';
import { getErrorMessage } from '../utils/getErrorMessage';
import UserService from '../services/userService';

class AuthMiddleware {
  private userService: UserService;
  
  constructor() {
    this.userService = UserService.getInstance();
  }

  authenticate: RequestHandler = async (req, res, next) => {
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

  isAuthor: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
  
      const { templateId } = req.params;
      if (!templateId || isNaN(parseInt(templateId))) {
        res.status(400).json({ message: 'Template ID is required' });
        return;
      }
  
      const isAuthor = await this.userService.checkIfUserIsAuthorOFTemplate(userId, parseInt(templateId));
      if (!isAuthor) {
        res.status(403).json({ message: 'Action not allowed' });
        return;
      }
  
      req.templateId = parseInt(templateId);
  
      next();
    } catch (err) {
      res.status(500).json({ message: 'Internal server err' });
    }
  };
}

export default AuthMiddleware;

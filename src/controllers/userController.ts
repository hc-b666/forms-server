import { Request, Response } from 'express';
import UserService from '../services/userService';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = UserService.getInstance();
  }

  getUserById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }

      const user = await this.userService.getUserById(parseInt(userId));

      res.status(200).json(user);
    } catch (err) {
      console.log(`Error in getUserById: ${err}`);
      res.status(500).json({ message: 'Internal server err' });
    }
  };
}

export default UserController;

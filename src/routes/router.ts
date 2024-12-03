import express from 'express';
import * as AuthController from '../controllers/AuthController';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'We got your request!' });
});

router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

export default router;

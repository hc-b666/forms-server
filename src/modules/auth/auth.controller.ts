import { RequestHandler } from 'express';
import { User, VerificationToken } from '@prisma/client';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

import TokenService from '../../utils/jwt';
import AuthService from './auth.service';
import { registerSchema } from './dto/register.dto';
import { verifySchema } from './dto/verify.dto';
import { loginSchema } from './dto/login.dto';
import { refreshTokenSchema } from './dto/refreshToken.dto';

class AuthController {
  private authService: AuthService;
  private transporter: nodemailer.Transporter;

  constructor() {
    this.authService = AuthService.getInstance();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private sendVerificationEmail = async (email: string, token: string, firstName: string) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;
    
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Email Verification</h1>
        <p>Hi ${firstName},</p>
        <p>Please click the link below to verify your email and complete your registration:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  };

  register: RequestHandler = async (req, res, next) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0];
        throw createHttpError(400, firstError.message);
      }

      const { firstName, email, password } = result.data;

      const userExists = await this.authService.findUserByEmail(email);
      if (userExists) {
        throw createHttpError(409, `User already exists with this email. Please login.`);
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await this.authService.createVerificationToken(result.data, passwordHash, token, expires);

      await this.sendVerificationEmail(email, token, firstName);

      res.status(200).json({ message: 'Please check your email to verify your account.' });
    } catch (err) {
      next(err);
    }
  };

  private isValidToken = (token: VerificationToken | null): token is VerificationToken => {
    if (!token) {
      throw createHttpError(400, 'Invalid verification token');
    }

    if (token.expires < new Date()) {
      throw createHttpError(400, 'Verification token has expired');
    }

    return true;
  };

  verify: RequestHandler = async (req, res, next) => {
    try {
      const result = verifySchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0];
        throw createHttpError(400, firstError.message);
      }

      const { token } = result.data;
      const verificationToken = await this.authService.findVerificationToken(token);
      if (!this.isValidToken(verificationToken)) {
        return;
      }

      await this.authService.createUser(verificationToken);
      await this.authService.deleteVerificationToken(token);

      res.status(200).json({ message: 'Email verified successfully. Please login.' });
    } catch (err) {
      next(err);
    }
  };

  private findUser = async (email: string, password: string) => {
    const user = await this.authService.findUserByEmail(email);
    if (!user) {
      throw createHttpError(400, `There is no user with this email`);
    }
  
    if (!user.verified) {
      throw createHttpError(400, `Please verify your email before logging in`);
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw createHttpError(400, `Invalid credentials`);
    }
  
    if (user.isBlocked) {
      throw createHttpError(401, 'You are blocked. Ask from our customer services to unblock you.');
    }
  
    return user;
  };

  private loginResponse = (user: User) => {
    const accessToken = TokenService.createAccessToken(user.id, user.email, user.role);
    const refreshToken = TokenService.createRefreshToken(user.id, user.email, user.role);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      message: 'Successfully logged in!',
    };
  };
  
  login: RequestHandler = async (req, res, next) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0];
        throw createHttpError(400, firstError.message);
      }
  
      const { email, password } = result.data;

      const user = await this.findUser(email, password);

      const response = this.loginResponse(user);
  
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  refreshToken: RequestHandler = async (req, res, next) => {
    try {
      const result = refreshTokenSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0];
        throw createHttpError(401, firstError.message);
      }

      const { refreshToken } = result.data;

      const decoded = TokenService.verifyToken(refreshToken);

      const user = await this.authService.findUserByEmail(decoded.email);
      if (!user) {
        throw createHttpError(401, 'Unauthorized');
      }

      if (user.isBlocked) {
        throw createHttpError(401, 'You are blocked. Ask from our customer services to unblock you.');
      }

      const newAccessToken = TokenService.createAccessToken(decoded.userId, decoded.email, decoded.role);

      res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();

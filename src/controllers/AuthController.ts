import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

import UserService from '../services/userService';
import TokenService from '../utils/jwt';
import { validateInput } from '../utils/validateInput';

class AuthController {
  private userService: UserService;
  private transporter: nodemailer.Transporter;
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.userService = UserService.getInstance();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, username, email, password } = req.body;
      validateInput(req.body, ['firstName', 'lastName', 'username', 'email', 'password']);

      const userExists = await this.userService.checkUserExists(email);
      if (userExists) {
        throw createHttpError(409, `User already exists with this email. Please login.`);
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await this.prisma.verificationToken.create({
        data: {
          token,
          email,
          firstName,
          lastName,
          username,
          passwordHash,
          expires,
        },
      });

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
      }),

      res.status(200).json({ message: 'Please check your email to verify your account.' });
    } catch (err) {
      next(err);
    }
  }

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      const verificationData = await this.prisma.verificationToken.findUnique({
        where: { token },
      });
      if (!verificationData) {
        throw createHttpError(400, 'Invalid verification token');
      }

      if (verificationData.expires < new Date()) {
        throw createHttpError(400, 'Verification token has expired');
      }

      await this.userService.createUser({
        firstName: verificationData.firstName,
        lastName: verificationData.lastName,
        username: verificationData.username,
        email: verificationData.email,
        passwordHash: verificationData.passwordHash,
        verified: true,
      });

      await this.prisma.verificationToken.delete({ where: { token } });

      res.status(200).json({ message: 'Email verified successfully. Please login.' });
    } catch (err) {
      next(err);
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      validateInput(req.body, ['email', 'password']);

      const user = await this.userService.getUserByEmail(email);
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

      const accessToken = TokenService.createAccessToken(user.id, user.email, user.role);
      const refreshToken = TokenService.createRefreshToken(user.id, user.email, user.role);

      const response = {
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
      }

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw createHttpError(401, `Invalid token`);
      }

      const decoded = TokenService.verifyToken(refreshToken);

      const user = await this.userService.checkUserExists(decoded.email);
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

export default AuthController;

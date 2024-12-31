import { PrismaClient, VerificationToken } from '@prisma/client';
import type { RegisterDto } from './dto/register.dto';

export default class AuthService {
  private prisma: PrismaClient;
  private static instance: AuthService;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }

    return this.instance;
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findVerificationToken(token: string) {
    return await this.prisma.verificationToken.findUnique({ where: { token } });
  }

  async createUser(dto: VerificationToken) {
    await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        username: dto.username,
        email: dto.email,
        passwordHash: dto.passwordHash,
        verified: true,
      },
    });
  }

  async createVerificationToken(dto: RegisterDto, passwordHash: string, token: string, expires: Date) {
    await this.prisma.verificationToken.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        username: dto.username,
        email: dto.email,
        passwordHash,
        token,
        expires,
      },
    });
  }

  async deleteVerificationToken(token: string) {
    await this.prisma.verificationToken.delete({ where: { token } });
  }
}

import { PrismaClient, UserRole } from '@prisma/client';

export default class AdminService {
  private prisma: PrismaClient;
  private static instance: AdminService;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): AdminService {
    if (!this.instance) {
      this.instance = new AdminService();
    }

    return this.instance;
  }

  async findUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        isBlocked: true,
        role: true,
      },
      where: {
        deletedAt: null,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  private async findUserById(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async block(userId: number) {
    if (!(await this.findUserById(userId))) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBlocked: true,
      },
    });

    return true;
  }

  async unblock(userId: number) {
    if (!(await this.findUserById(userId))) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBlocked: false,
      },
    });

    return true;
  }

  async promote(userId: number) {
    if (!(await this.findUserById(userId))) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: UserRole.ADMIN,
      },
    });

    return true;
  }

  async demote(userId: number) {
    if (!(await this.findUserById(userId))) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: UserRole.USER,
      },
    });

    return true;
  }

  async delete(userId: number) {
    if (!(await this.findUserById(userId))) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return true;
  }
}

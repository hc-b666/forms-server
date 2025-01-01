import { PrismaClient } from '@prisma/client';

export default class UserService {
  private prisma: PrismaClient;
  private static instance: UserService;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): UserService {
    if (!this.instance) {
      this.instance = new UserService();
    }

    return this.instance;
  }

  async findById(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async searchByEmaiL(query: string, userId: number) {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
      where: {
        id: {
          not: userId,
        },
        email: {
          contains: query,
        },
        deletedAt: null,
      },
    });
  }
}

import { PrismaClient, Prisma } from '@prisma/client';

class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(data: Prisma.UserCreateInput) {
    await this.prisma.user.create({ data });

    return 'User created successfully';
  }

  async checkUserExists(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user ? true : false;
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
      },
      where: {
        id: userId,
      },
    });

    return user ? user : null;
  }
}

export default UserService;

import { PrismaClient, Prisma } from '@prisma/client';

class UserService {
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

  async createUser(data: Prisma.UserCreateInput) {
    await this.prisma.user.create({ data });
  }

  async checkUserExists(email: string) {
    const user = await this.prisma.user.findUnique({ 
      select: {
        id: true,
        email: true,
        role: true,
        isBlocked: true,
      },
      where: { email } 
    });

    return user;
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async getUsers() {
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
      orderBy: {
        id: 'asc',
      },
    });
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

  async hasUserSubmittedForm(authorId: number, templateId: number) {
    const form = await this.prisma.form.findFirst({
      where: {
        authorId,
        templateId,
        deletedAt: null,
      },
    });

    return form ? true : false;
  }

  async checkIfUserIsAuthorOFTemplate(userId: number, templateId: number) {
    const template = await this.prisma.template.findFirst({
      where: { id: templateId, createdBy: userId },
    });

    return template ? true : false;
  }

  async checkIfUserIsAuthorOfForm(userId: number, formId: number) {
    const form = await this.prisma.form.findFirst({
      where: {
        id: formId,
        authorId: userId,
      }
    });

    return form ? true : false;
  }

  async searchUserByEmail(query: string, userId: number) {
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
      },
    });
  }
}

export default UserService;

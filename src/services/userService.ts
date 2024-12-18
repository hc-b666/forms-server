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

  async hasUserSubmittedForm(userId: number, templateId: number) {
    const form = await this.prisma.form.findFirst({
      where: {
        filledBy: userId,
        templateId,
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
}

export default UserService;

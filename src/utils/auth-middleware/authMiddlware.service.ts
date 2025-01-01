import { PrismaClient } from '@prisma/client';

class AuthMiddlewareService {
  private prisma: PrismaClient;
  private static instance: AuthMiddlewareService;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): AuthMiddlewareService {
    if (!this.instance) {
      this.instance = new AuthMiddlewareService();
    }

    return this.instance;
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async isAuthorOfTemplate(userId: number, templateId: number) {
    const template = await this.prisma.template.findFirst({
      where: {
        id: templateId,
        createdBy: userId,
      },
    });

    return template ? true : false;
  }

  async isAuthorOfForm(userId: number, formId: number) {
    const form = await this.prisma.form.findFirst({
      where: {
        id: formId,
        authorId: userId,
      },
    });

    return form ? true : false;
  }

}

export default AuthMiddlewareService;

import { PrismaClient } from '@prisma/client';

class CommentService {
  private prisma: PrismaClient;
  private static instance: CommentService;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): CommentService {
    if (!this.instance) {
      this.instance = new CommentService();
    }

    return this.instance;
  }

  async createComment(templateId: number, userId: number, content: string) {
    return await this.prisma.comment.create({
      data: {
        templateId,
        userId,
        content,
      },
    });
  }

  async getCommentByTemplateId(templateId: number) {
    const comments = await this.prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      where: {
        templateId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments;
  }
}

export default CommentService;

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

  async findComments(templateId: number) {
    return await this.prisma.comment.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      where: {
        templateId,
        author: {
          deletedAt: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(templateId: number, authorId: number, content: string) {
    return await this.prisma.comment.create({
      data: {
        templateId,
        authorId,
        content,
      },
    });
  }
}

export default CommentService;

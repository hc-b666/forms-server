import { PrismaClient } from "@prisma/client";

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
}

export default CommentService;

import { PrismaClient } from '@prisma/client';

class LikeService {
  private prisma: PrismaClient;
  private static instance: LikeService;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): LikeService {
    if (!this.instance) {
      this.instance = new LikeService();
    }

    return this.instance;
  }

  async findLikes(userId: number, templateId: number) {
    const isLiked = await this.prisma.like.findUnique({
      where: {
        userId_templateId: {
          userId,
          templateId,
        },
        user: {
          deletedAt: null,
        },
      },
    });

    const likeCount = await this.prisma.like.count({
      where: {
        templateId,
      },
    });

    return { isLiked: !!isLiked, likeCount };
  }

  async getLikeCount(templateId: number) {
    return await this.prisma.like.count({
      where: {
        templateId,
        user: {
          deletedAt: null,
        },
      },
    });
  }

  async toggleLike(userId: number, templateId: number) {
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_templateId: {
          userId,
          templateId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: {
          userId_templateId: {
            userId,
            templateId,
          },
        },
      });

      return false;
    } else {
      await this.prisma.like.create({
        data: {
          templateId,
          userId,
        },
      });

      return true;
    }
  }
}

export default LikeService;

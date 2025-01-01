import { PrismaClient } from '@prisma/client';

class TagService {
  private prisma: PrismaClient;
  private static instance: TagService;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): TagService {
    if (!this.instance) {
      this.instance = new TagService();
    }

    return this.instance;
  }

  async findTags() {
    return await this.prisma.tag.findMany({ take: 20 });
  }

  async searchTags(query: string) {
    return await this.prisma.tag.findMany({
      where: {
        tagName: {
          contains: query,
        },
      },
      take: 10,
    });
  }
}

export default TagService;

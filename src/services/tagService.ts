import { PrismaClient } from '@prisma/client';

class TagService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getTags() {
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

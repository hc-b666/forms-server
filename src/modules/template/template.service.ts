import { PrismaClient } from '@prisma/client';
import { QuestionService } from '../question';
import { TagService } from '../tag';
import { CreateTemplateDto } from './dto/createTemplate.dto';
import { UpdateDetailsDto } from './dto/updateDetails.dto';

class TemplateService {
  private prisma: PrismaClient;
  private questionService: QuestionService;
  private tagService: TagService;
  private static instance: TemplateService;

  private constructor() {
    this.prisma = new PrismaClient();
    this.questionService = QuestionService.getInstance();
    this.tagService = TagService.getInstance();
  }

  public static getInstance(): TemplateService {
    if (!this.instance) {
      this.instance = new TemplateService();
    }

    return this.instance;
  }

  async findAll(limit = 20) {
    const templates = await this.prisma.template.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        createdAt: true,
        imageId: true,
        imageUrl: true,
        _count: {
          select: {
            forms: {
              where: {
                deletedAt: null,
                author: {
                  deletedAt: null,
                },
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      where: {
        isPublic: true,
        deletedAt: null,
        creator: {
          deletedAt: null,
        },
      },
      orderBy: {
        forms: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return templates.map((template) => ({
      id: template.id,
      title: template.title,
      description: template.description,
      topic: template.topic,
      createdAt: template.createdAt.toISOString(),
      creator: { ...template.creator },
      responses: template._count.forms,
      imageId: template.imageId,
      imageUrl: template.imageUrl,
    }));
  }

  async findTop(limit = 5) {
    const templates = await this.prisma.template.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        createdAt: true,
        imageId: true,
        imageUrl: true,
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
        _count: {
          select: {
            forms: {
              where: {
                deletedAt: null,
                author: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      },
      where: {
        isPublic: true,
        deletedAt: null,
        creator: {
          deletedAt: null,
        },
      },
      orderBy: {
        forms: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return templates.map((template) => ({
      id: template.id,
      title: template.title,
      description: template.description,
      topic: template.topic,
      createdAt: template.createdAt,
      creator: { ...template.creator },
      responses: template._count.forms,
      imageId: template.imageId,
      imageUrl: template.imageUrl,
    }));
  }

  async findLatest(limit = 10) {
    const templates = await this.prisma.template.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        createdAt: true,
        imageId: true,
        imageUrl: true,
        _count: {
          select: {
            forms: {
              where: {
                deletedAt: null,
                author: {
                  deletedAt: null,
                },
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      where: {
        isPublic: true,
        deletedAt: null,
        creator: {
          deletedAt: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return templates.map((template) => ({
      id: template.id,
      title: template.title,
      description: template.description,
      topic: template.topic,
      createdAt: template.createdAt.toISOString(),
      creator: { ...template.creator },
      responses: template._count.forms,
      imageId: template.imageId,
      imageUrl: template.imageUrl,
    }));
  }

  async findById(templateId: number) {
    const template = await this.prisma.template.findUnique({
      where: {
        id: templateId,
        creator: {
          deletedAt: null,
        },
      },
      include: {
        _count: {
          select: {
            forms: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
        accessControls: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        questions: {
          include: {
            options: {
              select: {
                id: true,
                option: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return template
      ? {
          id: template.id,
          title: template.title,
          description: template.description,
          topic: template.topic,
          createdAt: template.createdAt.toISOString(),
          creator: {
            id: template.creator.id,
            email: template.creator.email,
          },
          questions: template.questions.map((q) => ({
            id: q.id,
            questionText: q.questionText,
            type: q.type,
            options: q.options,
            order: q.order,
          })),
          responses: template._count.forms,
          tags: template.tags.map((t) => t.tag),
          accessControls: template.accessControls.map((ac) => ac.user),
          isPublic: template.isPublic,
          imageId: template.imageId,
          imageUrl: template.imageUrl,
        }
      : null;
  }

  async findPublicTemplatesByUserId(userId: number, page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const total = await this.prisma.template.count({
      where: {
        createdBy: userId,
        isPublic: true,
        deletedAt: null,
        creator: {
          deletedAt: null,
        },
      },
    });

    const templates = await this.prisma.template.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            forms: {
              where: {
                deletedAt: null,
              },
            },
            likes: {
              where: {
                user: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      },
      where: {
        createdBy: userId,
        isPublic: true,
        deletedAt: null,
        creator: {
          deletedAt: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return {
      templates: templates.map((template) => ({
        id: template.id,
        title: template.title,
        description: template.description,
        topic: template.topic,
        createdAt: template.createdAt,
        responses: template._count.forms,
        likes: template._count.likes,
        tags: template.tags.map((t) => t.tag),
      })),
      metadata: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPrivateTemplatesByUserId(userId: number, page = 1, limit = 5) {
    const skip = (page - 1) * limit;

    const total = await this.prisma.template.count({
      where: {
        createdBy: userId,
        isPublic: false,
        deletedAt: null,
        creator: {
          deletedAt: null,
        },
      },
    });

    const templates = await this.prisma.template.findMany({
      where: {
        createdBy: userId,
        isPublic: false,
        deletedAt: null,
        creator: {
          deletedAt: null,
        },
      },
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
        _count: {
          select: {
            forms: {
              where: {
                deletedAt: null,
              },
            },
            likes: {
              where: {
                user: {
                  deletedAt: null,
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return {
      templates: templates.map((template) => ({
        id: template.id,
        title: template.title,
        description: template.description,
        topic: template.topic,
        createdAt: template.createdAt,
        responses: template._count.forms,
        likes: template._count.likes,
        tags: template.tags.map((t) => t.tag),
      })),
      metadata: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPrivateAccessibleTemplatesByUserId(userId: number, page = 1, limit = 5) {
    const skip = (page - 1) * limit;

    const total = await this.prisma.accessControl.count({
      where: {
        userId,
        template: {
          isPublic: false,
          deletedAt: null,
        },
        user: {
          deletedAt: null,
        },
      },
    });

    const accessibles = await this.prisma.accessControl.findMany({
      select: {
        template: {
          include: {
            tags: {
              select: {
                tag: true,
              },
            },
            _count: {
              select: {
                forms: {
                  where: {
                    deletedAt: null,
                  },
                },
                likes: {
                  where: {
                    user: {
                      deletedAt: null,
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        userId,
        template: {
          isPublic: false,
          deletedAt: null,
        },
        user: {
          deletedAt: null,
        },
      },
      orderBy: {
        template: {
          createdAt: 'desc',
        },
      },
      skip,
      take: limit,
    });

    return {
      templates: accessibles.map((accessible) => ({
        id: accessible.template.id,
        title: accessible.template.title,
        description: accessible.template.description,
        topic: accessible.template.topic,
        createdAt: accessible.template.createdAt,
        responses: accessible.template._count.forms,
        likes: accessible.template._count.likes,
        tags: accessible.template.tags.map((t) => t.tag),
      })),
      metadata: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByTagId(tagId: number, limit = 20) {
    const templates = await this.prisma.template.findMany({
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
        _count: {
          select: {
            forms: true,
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      where: {
        tags: {
          some: {
            tagId,
          },
        },
        creator: {
          deletedAt: null,
        },
        isPublic: true,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return templates.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      topic: t.topic,
      createdAt: t.createdAt.toISOString(),
      responses: t._count.forms,
      tags: t.tags.map((t) => t.tag.tagName),
      creator: {
        id: t.creator.id,
        email: t.creator.email,
      },
    }));
  }

  async create(userId: number, dto: CreateTemplateDto) {
    const template = await this.prisma.template.create({
      data: {
        title: dto.title,
        description: dto.description,
        topic: dto.topic,
        isPublic: dto.type === 'public',
        createdBy: userId,
      },
    });

    if (dto.type === 'private') {
      dto.users.forEach(async (userId) =>
        this.prisma.accessControl.create({
          data: {
            templateId: template.id,
            userId,
          },
        })
      );
    }

    dto.questions.forEach(async (question) =>
      this.questionService.createQuestion(template.id, question)
    );

    dto.tags.forEach(async (tagName) => {
      const tag = await this.tagService.createTag(tagName);
      await this.tagService.createTemplateTag(template.id, tag.id);
    });

    return template.id;
  }

  async addImage(templateId: number, imageId: string) {
    await this.prisma.template.update({
      where: {
        id: templateId,
      },
      data: {
        imageId,
        imageUrl: `https://drive.google.com/uc?id=${imageId}`,
      },
    });
  }

  async search(query: string) {
    const templates = await this.prisma.template.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        createdAt: true,
        _count: {
          select: {
            forms: true,
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      where: {
        isPublic: true,
        deletedAt: null,
        creator: {
          deletedAt: null,
        },
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { questions: { some: { questionText: { contains: query } } } },
          { tags: { some: { tag: { tagName: { contains: query } } } } },
        ],
      },
    });

    return templates.map((template) => ({
      id: template.id,
      title: template.title,
      description: template.description,
      topic: template.topic,
      createdAt: template.createdAt.toISOString(),
      creator: { ...template.creator },
      responses: template._count.forms,
    }));
  }

  async updateDetails(templateId: number, dto: UpdateDetailsDto) {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return false;
    }

    await this.prisma.template.update({
      where: { id: templateId },
      data: {
        title: dto.title,
        description: dto.description,
        topic: dto.topic,
      },
    });

    const tags = await this.tagService.findTagsByTemplateId(templateId);
    const tagNames = tags.map((t) => t.tagName);

    const newTags = dto.tags.filter((tag) => !tagNames.includes(tag));
    const oldTags = tags.filter((t) => !dto.tags.includes(t.tagName));

    newTags.forEach(async (tagName) => {
      const tag = await this.tagService.createTag(tagName);
      await this.tagService.createTemplateTag(templateId, tag.id);
    });

    oldTags.forEach(async (tag) => {
      await this.tagService.deleteTemplateTag(templateId, tag.id);
    });

    const accessibles = await this.prisma.accessControl.findMany({
      where: {
        templateId,
      },
    });

    const newUsers = dto.users.filter(
      (userId) => !accessibles.some((a) => a.userId === userId)
    );

    const oldUsers = accessibles.filter((a) => !dto.users.includes(a.userId));

    newUsers.forEach(async (userId) =>
      this.prisma.accessControl.create({
        data: {
          templateId,
          userId,
        },
      })
    );

    oldUsers.forEach(async (a) => {
      await this.prisma.accessControl.delete({
        where: {
          id: a.id,
        },
      });
    });

    return true;
  }

  async delete(templateId: number) {
    await this.prisma.template.update({
      where: {
        id: templateId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export default TemplateService;

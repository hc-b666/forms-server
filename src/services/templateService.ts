import { PrismaClient, TemplateTopic } from '@prisma/client';
import TagService from './tagService';
import QuestionService from './questionService';

interface CreateTemplateBody {
  title: string;
  description: string;
  createdBy: number;
  topic: TemplateTopic;
  type: 'public' | 'private';
  questions: Question[];
  tags: string[];
  users: number[];
}

interface EditTemplateDetails {
  title: string;
  description: string;
  topic: TemplateTopic;
  tags: string[];
}

interface TemplateSelect {
  id: true;
  title: true;
  description: true;
  topic: true;
  createdAt: true;
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
      id: true;
      email: true;
    };
  };
}

class TemplateService {
  private prisma: PrismaClient;
  private tagService: TagService;
  private questionService: QuestionService;
  private static instance: TemplateService;

  private constructor() {
    this.prisma = new PrismaClient();
    this.tagService = TagService.getInstance();
    this.questionService = QuestionService.getInstance();
  }

  public static getInstance(): TemplateService {
    if (!this.instance) {
      this.instance = new TemplateService();
    }

    return this.instance;
  }

  private readonly defaultSelect: TemplateSelect = {
    id: true,
    title: true,
    description: true,
    topic: true,
    createdAt: true,
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
  }

  private readonly publicTemplateWhere = {
    isPublic: true,
    deletedAt: null,
  } as const;

  private mapTemplateToDTO(template: any) {
    return {
      id: template.id,
      title: template.title,
      description: template.description,
      topic: template.topic,
      createdAt: template.createdAt.toISOString(),
      creator: template.creator && { ...template.creator },
      responses: template._count?.forms ?? 0,
    };
  }

  async getTemplates() {
    const templates = await this.prisma.template.findMany({
      select: this.defaultSelect,
      where: this.publicTemplateWhere,
    });

    return templates.map(this.mapTemplateToDTO);
  }

  async getTopTemplates(limit = 5) {
    const templates = await this.prisma.template.findMany({
      select: this.defaultSelect,
      where: this.publicTemplateWhere,
      orderBy: {
        forms: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return templates.map(this.mapTemplateToDTO);
  }

  async getLatestTemplates(limit = 10) {
    const templates = await this.prisma.template.findMany({
      select: this.defaultSelect,
      where: this.publicTemplateWhere,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return templates.map(this.mapTemplateToDTO);
  }

  async getTemplateById(templateId: number) {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
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
          tags: template.tags.map((t) => t.tag.tagName),
        }
      : null;
  }

  async getTemplatesByUserId(userId: number) {
    const templates = await this.prisma.template.findMany({
      where: {
        createdBy: userId,
        isPublic: true,
        deletedAt: null,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            forms: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return templates.map((template) => ({
      id: template.id,
      title: template.title,
      description: template.description,
      topic: template.topic,
      createdAt: template.createdAt.toISOString(),
      responses: template._count.forms,
      tags: template.tags.map((t) => t.tag.tagName),
    }));
  }

  async getPrivateTemplatesByUserId(userId: number) {
    const templates = await this.prisma.template.findMany({
      where: {
        createdBy: userId,
        isPublic: false,
        deletedAt: null,
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
            }
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return templates.map((template) => ({
      id: template.id,
      title: template.title,
      description: template.description,
      topic: template.topic,
      createdAt: template.createdAt.toISOString(),
      responses: template._count.forms,
      tags: template.tags.map((t) => t.tag.tagName),
    }));
  }

  async getPrivateTemplatesForAccessibleUser(userId: number) {
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
                forms: true,
              },
            },
          },
        },
      },
      where: { 
        userId, 
        template: { 
          isPublic: false, 
          deletedAt: null 
        } 
      },
      orderBy: {
        template: {
          createdAt: 'desc',
        },
      },
    });

    return accessibles.map((accessible) => ({
      id: accessible.template.id,
      title: accessible.template.title,
      description: accessible.template.description,
      topic: accessible.template.topic,
      createdAt: accessible.template.createdAt.toISOString(),
      responses: accessible.template._count.forms,
      tags: accessible.template.tags.map((t) => t.tag.tagName),
    }));
  }

  async getTemplatesByTagId(tagId: number) {
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
        isPublic: true,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
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

  async createTemplate(data: CreateTemplateBody) {
    const template = await this.prisma.template.create({
      data: {
        title: data.title,
        description: data.description,
        topic: data.topic,
        isPublic: data.type === 'public',
        createdBy: data.createdBy,
      },
    });

    if (data.type === 'private') {
      data.users.forEach(async (userId) =>
        this.prisma.accessControl.create({
          data: {
            templateId: template.id,
            userId,
          },
        })
      );
    }

    data.questions.forEach(async (q) =>
      this.questionService.createQuestion(q, template.id)
    );

    if (data.tags && data.tags.length > 0) {
      data.tags.forEach(async (tagName) => {
        const tag = await this.tagService.createTag(tagName);
        await this.tagService.createTemplateTag(template.id, tag.id);
      });
    }

    return template;
  }

  async searchTemplates(query: string) {
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
        OR: [
          { title: { search: query } },
          { description: { search: query } },
          { questions: { some: { questionText: { search: query } } } },
          { tags: { some: { tag: { tagName: { search: query } } } } },
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

  async editTemplateDetails(templateId: number, data: EditTemplateDetails) {
    const template = await this.prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return false;
    }

    await this.prisma.template.update({
      where: { id: templateId },
      data: {
        title: data.title,
        description: data.description,
        topic: data.topic,
      },
    });

    const tags = await this.tagService.getTagsByTemplateId(templateId);
    const tagNames = tags.map((t) => t.tagName);

    const newTags = data.tags.filter((tag) => !tagNames.includes(tag));
    const oldTags = tags.filter((t) => !data.tags.includes(t.tagName));

    newTags.forEach(async (tagName) => {
      const tag = await this.tagService.createTag(tagName);
      await this.tagService.createTemplateTag(templateId, tag.id);
    });

    oldTags.forEach(async (tag) => {
      await this.tagService.deleteTemplateTag(templateId, tag.id);
    });

    return true;
  }

  async deleteTemplate(templateId: number) {
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

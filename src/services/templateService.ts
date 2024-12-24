import { PrismaClient, TemplateTopic } from '@prisma/client';
import TagService from './tagService';
import QuestionService from './questionService';

interface ICreateTemplateBody {
  title: string;
  description: string;
  createdBy: number;
  topic: TemplateTopic;
  type: 'public' | 'private';
  questions: Question[];
  tags: string[];
  users: number[];
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

  async getTemplates() {
    const templates = await this.prisma.template.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        createdAt: true,
        _count: {
          select: { 
            likes: true, 
            forms: true 
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
      creator: { ...template.creator },
      responses: template._count.forms,
      likes: template._count.likes,
    }));
  }

  async getTopTemplates() {
    const templates = await this.prisma.template.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        createdAt: true,
        _count: {
          select: { 
            likes: true, 
            forms: true 
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
      },
      orderBy: {
        forms: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return templates.map((template) => ({
      id: template.id,
      title: template.title,
      description: template.description,
      topic: template.topic,
      createdAt: template.createdAt.toISOString(),
      creator: { ...template.creator },
      responses: template._count.forms,
      likes: template._count.likes,
    }));
  }

  async getLatestTemplates() {
    const templates = await this.prisma.template.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        topic: true,
        createdAt: true,
        _count: {
          select: {
            likes: true,
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return templates.map((template) => ({
      id: template.id,
      title: template.title,
      description: template.description,
      topic: template.topic,
      createdAt: template.createdAt.toISOString(),
      creator: { ...template.creator },
      responses: template._count.forms,
      likes: template._count.likes,
    }));
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
            options: true,
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
        AND: {
          isPublic: true,
        }
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
        AND: {
          isPublic: false,
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
      tags: template.tags.map(t => t.tag.tagName),
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
      where: { userId },
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
      tags: accessible.template.tags.map(t => t.tag.tagName),
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
      },
      where: {
        tags: {
          some: {
            tagId,
          },
        },
        AND: {
          isPublic: true,
        },
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
      tags: t.tags.map(t => t.tag.tagName),
    }));
  }

  async createTemplate(data: ICreateTemplateBody) {
    const template = await this.prisma.template.create({
      data: {
        title: data.title,
        description: data.description,
        topic: data.topic,
        isPublic: data.type === 'public',
        createdBy: data.createdBy,
      },
    });

    if (data.type === "private") {
      data.users.forEach(async (userId) => this.prisma.accessControl.create({
        data: {
          templateId: template.id,
          userId,
        },
      }));
    }

    data.questions.forEach(async q => this.questionService.createQuestion(q, template.id));

    if (data.tags && data.tags.length > 0) {
      data.tags.forEach(async tagName => {
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
            likes: true, 
            forms: true 
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
      likes: template._count.likes,
    }));
  }
}

export default TemplateService;

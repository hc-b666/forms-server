import { PrismaClient } from '@prisma/client';
import TagService from './tagService';
import QuestionService from './questionService';

interface ICreateTemplateBody {
  title: string;
  description: string;
  createdBy: number;
  topic: TemplateTopic;
  type: 'public' | 'private';
  questions: IQuestionBody[];
  tags: string[];
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

  async getTopTemplates() {
    const templates = await this.prisma.template.findMany({
      include: {
        _count: {
          select: { likes: true, forms: true },
        },
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
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
      createAt: template.createdAt.toISOString(),
      email: template.creator.email,
      responses: template._count.forms,
      totalLikes: template._count.likes,
    }));
  }

  async getLatestTemplates() {
    const templates = await this.prisma.template.findMany({
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
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
      createAt: template.createdAt.toISOString(),
      email: template.creator.email,
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
        },
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
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
          createAt: template.createdAt.toISOString(),
          email: template.creator.email,
          questions: template.questions.map((q) => ({
            id: q.id,
            question: q.question,
            type: q.type,
            options: q.options,
          })),
          tags: template.tags.map((t) => t.tag.tagName),
          comments: template.comments.map((c) => ({
            id: c.id,
            content: c.content,
            createAt: c.createdAt.toISOString(),
            email: c.user.email,
          })),
        }
      : null;
  }

  async getProfile(userId: number) {
    const templates = await this.prisma.template.findMany({
      where: { createdBy: userId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
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
      createAt: template.createdAt.toISOString(),
      email: template.creator.email,
      responses: template._count.forms,
      tags: template.tags.map((t) => t.tag.tagName),
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

    data.questions.forEach(async q => this.questionService.createQuestion(q, template.id));

    if (data.tags && data.tags.length > 0) {
      data.tags.forEach(async tagName => {
        const tag = await this.tagService.createTag(tagName);
        await this.tagService.createTemplateTag(template.id, tag.id);
      });
    }

    return template;
  }
}

export default TemplateService;

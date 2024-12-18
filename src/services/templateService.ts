import { PrismaClient } from '@prisma/client';

interface ICreateTemplateBody {
  title: string;
  description: string;
  createdBy: number;
  topic: TemplateTopic;
  type: 'public' | 'private';
  questions: {
    question: string;
    type: QuestionType;
    options: string[];
  }[];
  tags: string[];
}

interface ICreateFormBody {
  filledBy: number;
  templateId: number;
  responses: {
    questionId: number;
    answer: string | number | number[];
  }[];
}

class TemplateService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
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

  async getForms(templateId: number) {
    const forms = await this.prisma.form.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      where: { templateId },
      orderBy: {
        filledAt: 'desc',
      },
    });

    return forms.map((f) => ({
      formId: f.id,
      filledAt: f.filledAt.toISOString(),
      email: f.user.email,
      filledBy: f.filledBy,
    }));
  }

  async getForm(formId: number) {
    const form = await this.prisma.form.findUnique({
      include: {
        responses: {
          include: {
            question: true,
            option: true,
          },
        },
      },
      where: {
        id: formId,
      },
    });

    const responses = new Map<number, IResponse & { options: string[] }>();

    form?.responses.forEach((r) => {
      if (!responses.has(r.questionId)) {
        responses.set(r.questionId, {
          questionId: r.questionId,
          question: r.question.question,
          type: r.question.type,
          responseId: r.id,
          answer: r.answer,
          optionId: r.optionId,
          option: r.option?.option || null,
          options: r.option ? [r.option.option] : [],
        });
      } else {
        const existing = responses.get(r.questionId)!;
        if (r.option && !existing.options.includes(r.option.option)) {
          existing.options.push(r.option.option);
        }
      }
    });

    return Array.from(responses.values());
  }

  async checkIfUserIsAuthorOFTemplate(userId: number, templateId: number) {
    const template = await this.prisma.template.findFirst({
      where: { id: templateId, createdBy: userId },
    });

    return template ? true : false;
  }

  async hasUserSubmittedForm(userId: number, templateId: number) {
    const form = await this.prisma.form.findFirst({
      where: {
        filledBy: userId,
        templateId,
      },
    });

    return form ? true : false;
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

    for (const q of data.questions) {
      const question = await this.prisma.question.create({
        data: {
          templateId: template.id,
          question: q.question,
          type: q.type,
        },
      });

      if (
        (q.type === 'MCQ' || q.type === 'CHECKBOX') &&
        q.options?.length > 0
      ) {
        for (const option of q.options) {
          await this.prisma.questionOption.create({
            data: {
              questionId: question.id,
              option,
            },
          });
        }
      }
    }

    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tag = await this.prisma.tag.upsert({
          where: { tagName },
          update: {},
          create: { tagName },
        });

        await this.prisma.templateTag.create({
          data: {
            templateId: template.id,
            tagId: tag.id,
          },
        });
      }
    }

    return template;
  }

  async createForm({ templateId, filledBy, responses }: ICreateFormBody) {
    const form = await this.prisma.form.create({
      data: {
        templateId,
        filledBy,
      },
    });

    for (const r of responses) {
      if (typeof r.answer === 'string') {
        await this.prisma.response.create({
          data: {
            formId: form.id,
            questionId: r.questionId,
            answer: r.answer,
          },
        });
      } else if (typeof r.answer === 'number') {
        await this.prisma.response.create({
          data: {
            formId: form.id,
            questionId: r.questionId,
            optionId: r.answer,
          },
        });
      } else {
        for (const optionId of r.answer) {
          await this.prisma.response.create({
            data: {
              formId: form.id,
              questionId: r.questionId,
              optionId,
            },
          });
        }
      }
    }
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

export default TemplateService;

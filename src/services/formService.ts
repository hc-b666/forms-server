import { PrismaClient } from '@prisma/client';
import ResponseService from './responseService';

interface ICreateForm {
  authorId: number;
  templateId: number;
  responses: {
    questionId: number;
    answer: string | number | number[];
  }[];
}

class FormService {
  private prisma: PrismaClient;
  private static instance: FormService;
  private responseService: ResponseService;

  private constructor() {
    this.prisma = new PrismaClient();
    this.responseService = ResponseService.getInstance();
  }

  public static getInstance(): FormService {
    if (!this.instance) {
      this.instance = new FormService();
    }

    return this.instance;
  }

  async getForms(templateId: number) {
    return await this.prisma.form.findMany({
      select: {
        id: true,        
        filledAt: true,
        author: {
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
  }

  async getFormsByUser(authorId: number) {
    const forms = await this.prisma.form.findMany({
      select: {
        id: true,
        filledAt: true,
        template: {
          select: {
            id: true,
            title: true,
            description: true,
            topic: true,
            tags: {
              select: {
                tag: {
                  select: {
                    id: true,
                    tagName: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        authorId,
        template: {
          deletedAt: null,
        },
      },
      orderBy: {
        filledAt: 'desc',
      },
    });

    return forms.map((f) => ({
      ...f,
      template: {
        ...f.template,
        tags: f.template.tags.map((t) => t.tag.tagName),
      },
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
          questionText: r.question.questionText,
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

  async createForm({ authorId, templateId, responses }: ICreateForm) {
    const form = await this.prisma.form.create({
      data: {
        authorId,
        templateId,
      },
    });

    responses.forEach(
      async (response) =>
        await this.responseService.createResponse(
          form.id,
          response.questionId,
          response.answer
        )
    );
  }
}

export default FormService;

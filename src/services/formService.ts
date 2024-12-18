import { PrismaClient } from '@prisma/client';
import ResponseService from './responseService';

interface ICreateForm {
  filledBy: number;
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

  async getFormsByUser(userId: number) {
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
        filledBy: userId,
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

  async createForm({ filledBy, templateId, responses }: ICreateForm) {
    const form = await this.prisma.form.create({
      data: {
        filledBy,
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

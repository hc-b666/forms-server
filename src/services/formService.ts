import { PrismaClient } from '@prisma/client';
import ResponseService from './responseService';
import QuestionService from './questionService';

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
  private questionService: QuestionService;

  private constructor() {
    this.prisma = new PrismaClient();
    this.responseService = ResponseService.getInstance();
    this.questionService = QuestionService.getInstance();
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
      where: {
        templateId,
        deletedAt: null,
        author: {
          deletedAt: null,
        },
      },
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
        author: {
          deletedAt: null,
        },
        deletedAt: null,
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

  async getForm(formId: number, templateId: number) {
    const form = await this.prisma.form.findUnique({
      select: {
        id: true,
        authorId: true,
        filledAt: true,
      },
      where: {
        id: formId,
        deletedAt: null,
        author: {
          deletedAt: null,
        },
      },
    });

    if (!form) {
      return null;
    }

    const questions = await this.questionService.getQuestions(templateId);
    const responses = await this.responseService.getResponses(formId);

    return {
      form,
      questions,
      responses,
    };
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

  async deleteForm(formId: number) {
    await this.prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export default FormService;

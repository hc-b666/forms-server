import { PrismaClient } from '@prisma/client';
import { QuestionService } from '../question';
import { ResponseService } from '../response';
import { type CreateFormDto } from './dto/createForm.dto';

export default class FormService {
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

  async findByTemplateId(templateId: number) {
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

  async findByUserId(userId: number) {
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
        authorId: userId,
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

  async findById(formId: number, templateId: number) {
    const form = await this.prisma.form.findFirst({
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

    const questions = await this.questionService.getQuestions(templateId);
    const responses = await this.responseService.findByFormId(formId);

    return { form, questions, responses };
  }

  async hasSubmittedForm(userId: number, templateId: number) {
    const form = await this.prisma.form.findFirst({
      where: {
        authorId: userId,
        templateId,
        deletedAt: null,
      },
    });

    return form ? true : false;
  }

  async create(userId: number, templateId: number, dto: CreateFormDto) {
    const form = await this.prisma.form.create({
      data: {
        authorId: userId,
        templateId,
      },
    });

    dto.responses.forEach(
      async (response) =>
        await this.responseService.create(
          form.id,
          response.questionId,
          response.answer
        )
    );
  }

  async delete(formId: number) {
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

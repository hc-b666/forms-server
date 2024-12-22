import { PrismaClient } from '@prisma/client';

class QuestionService {
  private prisma: PrismaClient;
  private static instance: QuestionService;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): QuestionService {
    if (!this.instance) {
      this.instance = new QuestionService();
    }

    return this.instance;
  }

  async createQuestion({ questionText, type, options, order }: Question, templateId: number) {
    const q = await this.prisma.question.create({
      data: {
        templateId,
        questionText,
        type,
        order,
      },
    });

    if ((type === 'MCQ' || type === 'CHECKBOX') && options.length > 0) {
      options.forEach(async (option) =>
        this.createQuestionOption(option, q.id)
      );
    }
  }

  async createQuestionOption(option: string, questionId: number) {
    await this.prisma.questionOption.create({
      data: {
        questionId,
        option,
      },
    });
  }
}

export default QuestionService;

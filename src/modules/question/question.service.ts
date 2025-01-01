import { PrismaClient, QuestionType } from '@prisma/client';
import { CreateQuestionDto } from './dto/createQuestion.dto';

interface EditQuestionData {
  id: number;
  questionText: string;
  type: QuestionType;
  order: number;
  options: {
    id: number | string;
    option: string;
  }[];
}

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

  async getQuestions(templateId: number) {
    return await this.prisma.question.findMany({
      where: {
        templateId,
      },
      select: {
        id: true,
        questionText: true,
        type: true,
        order: true,
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
    });
  }

  async createQuestion(templateId: number, dto: CreateQuestionDto) {
    const { questionText, type, order, options } = dto;

    const question = await this.prisma.question.create({
      data: {
        templateId,
        questionText,
        type,
        order,
      },
    });

    if ((type === 'MCQ' || type === 'CHECKBOX') && options.length > 0) {
      options.forEach(async (option) =>
        this.createQuestionOption(question.id, option)
      );
    }
  }

  async createQuestionOption(questionId: number, option: string) {
    await this.prisma.questionOption.create({
      data: {
        questionId,
        option,
      },
    });
  }

  async editQuestion({ id, questionText, type, options, order }: EditQuestionData) {
    await this.prisma.question.update({
      where: {
        id,
      },
      data: {
        questionText,
        type,
        order,
      },
    });

    if ((type === 'MCQ' || type === 'CHECKBOX') && options.length > 0) {
      options.forEach(async (option) => {
        if (typeof option.id === 'string') {
          await this.createQuestionOption(id, option.option);
        } else {
          await this.prisma.questionOption.update({
            where: {
              id: option.id,
            },
            data: {
              option: option.option,
            },
          });
        }
      });
    }
  }
  
}

export default QuestionService;

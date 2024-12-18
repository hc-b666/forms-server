import { PrismaClient } from '@prisma/client';

class ResponseService {
  private prisma: PrismaClient;
  private static instance: ResponseService;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): ResponseService {
    if (!this.instance) {
      this.instance = new ResponseService();
    }

    return this.instance;
  }

  async createResponse(
    formId: number,
    questionId: number,
    answer: string | number | number[]
  ) {
    if (typeof answer === 'string') {
      await this.prisma.response.create({
        data: {
          formId,
          questionId,
          answer,
        },
      });
    } else if (typeof answer === 'number') {
      await this.prisma.response.create({
        data: {
          formId,
          questionId,
          optionId: answer,
        },
      });
    } else {
      answer.forEach(async (optionId) => {
        await this.prisma.response.create({
          data: {
            formId,
            questionId,
            optionId,
          },
        });
      });
    }
  }
}

export default ResponseService;

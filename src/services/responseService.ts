import { PrismaClient, QuestionType } from '@prisma/client';

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

  async getResponses(formId: number) {
    return await this.prisma.response.findMany({
      where: {
        formId,
      },
    });
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

  async editResponse(formId: number, data: EditResponseData) {
    switch (data.questionType) {
      case 'TEXT':
      case 'PARAGRAPH': {
        await this.prisma.response.update({
          where: {
            id: data.responseId,
          },
          data: {
            answer: data.answer,
          },
        });
        break;
      }

      case 'MCQ': {
        await this.prisma.response.update({
          where: {
            id: data.responseId,
          },
          data: {
            optionId: data.optionId,
          },
        });
        break;
      }

      case 'CHECKBOX': {
        const existingResponses = await this.prisma.response.findMany({
          where: {
            formId,
            questionId: data.questionId,
          },
        });

        const newOptionIds = new Set(data.optionIds);

        const responsesToDelete = existingResponses.filter(
          (response) => !newOptionIds.has(response.optionId as number)
        );

        if (responsesToDelete.length > 0) {
          await this.prisma.response.deleteMany({
            where: {
              id: {
                in: responsesToDelete.map((response) => response.id),
              },
            },
          });
        }

        for (const optionId of data.optionIds || []) {
          const exists = existingResponses.find(
            (response) => response.optionId === optionId
          );

          if (!exists) {
            await this.prisma.response.create({
              data: {
                formId,
                questionId: data.questionId,
                optionId,
              },
            });
          } else {
            await this.prisma.response.update({
              where: {
                id: exists.id,
              },
              data: {
                optionId,
              },
            });
          }
        }
        break;
      }
    }
  }
}

export default ResponseService;

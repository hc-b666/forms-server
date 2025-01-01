import { QuestionType, UserRole } from "@prisma/client";

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: UserRole;
    };
    templateId?: number;
  }
}

declare global {

  interface Question {
    order: number;
    questionText: string;
    type: QuestionType;
    options: string[];
  }

}

export {};

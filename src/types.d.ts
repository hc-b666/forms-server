declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
    templateId?: number;
  }
}

declare global {
  interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    passwordHash: string;
    role: 'USER' | 'ADMIN';
    isBlocked: boolean;
    createdAt: Date;
  }

  type QuestionType = 'TEXT' | 'PARAGRAPH' | 'MCQ' | 'CHECKBOX';

  type TemplateTopic = 'EDU' | 'QUIZ' | 'OTHER';

  interface IQuestionBody {
    question: string;
    type: QuestionType;
    options: string[];
  }

  interface IProfileTemplate {
    templateId: number;
    title: string;
    topic: TemplateTopic;
    createdAt: Date;
    tags: string[];
    responses: string;
  }

  interface IProfileUser {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  }

  interface ITopTemplate {
    id: number;
    title: string;
    description: string;
    topic: string;
    createdAt: string;
    email: string;
    responses: string;
    totalLikes: string;
    hasLiked: boolean;
  }

  interface ILatestTemplate {
    id: number;
    title: string;
    description: string;
    topic: string;
    createdAt: string;
    email: string;
  }

  interface IQuestionOption {
    id: number;
    option: string;
  }

  interface IQuestion {
    id: number;
    question: string;
    type: string;
    options: IQuestionOption[];
  }

  interface IComment {
    commentId: number;
    content: string;
    createdAt: string;
    authorId: number;
    email: string;
  }

  interface ISingleTemplate {
    templateId: number;
    title: string;
    description: string;
    topic: string;
    createdAt: string;
    userId: number;
    email: string;
    tags: string[];
    questions: IQuestion[];
    comments: IComment[];
  }

  interface IResponse {
    questionId: number;
    question: string;
    type: QuestionType;
    responseId: number;
    answer: string | null;
    optionId: number | null;
    option: string | null;
  }
}

export {};

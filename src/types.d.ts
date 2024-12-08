declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
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
    role: 'user' | 'admin';
    isBlocked: boolean;
    createdAt: Date;
  }

  type QuestionType = 'short' | 'paragraph' | 'mcq' | 'checkbox';

  type TemplateTopic = 'edu' | 'quiz' | 'other';
}

export {};

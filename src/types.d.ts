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
    topic: string;
    createdAt: string;
    email: string;
    responses: string;
    tags: string[];
    totalLikes: string;
    hasLiked: boolean;
  }
}

export {};

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
}

export {};

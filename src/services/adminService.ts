import { PrismaClient, UserRole } from "@prisma/client";
import UserService from "./userService";

export default class AdminService {
  private userService: UserService;
  private prisma: PrismaClient;
  private static instance: AdminService;

  private constructor() {
    this.userService = UserService.getInstance();
    this.prisma = new PrismaClient();
  }

  public static getInstance(): AdminService {
    if (!this.instance) {
      this.instance = new AdminService();
    }

    return this.instance;
  }

  async blockUser(userId: number) {
    if (!await this.userService.getUserById(userId)) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBlocked: true,
      },
    });

    return true;
  }

  async unblockUser(userId: number) {
    if (!await this.userService.getUserById(userId)) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isBlocked: false,
      },
    });

    return true;
  }

  async promoteToAdmin(userId: number) {
    if (!await this.userService.getUserById(userId)) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: UserRole.ADMIN,
      },
    });

    return true;
  }

  async demoteToUser(userId: number) {
    if (!await this.userService.getUserById(userId)) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: UserRole.USER,
      },
    });

    return true;
  }

  async deleteUser(userId: number) {
    if (!await this.userService.getUserById(userId)) {
      return false;
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return true;
  }
}

import prisma from "../../config/prisma";

export class AuthRepository {
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static async createUserWithEmail(email: string) {
    return prisma.user.create({
      data: {
        email,
      },
    });
  }
}

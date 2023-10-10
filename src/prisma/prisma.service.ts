import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { User } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  async createUser(data: Pick<User, "password" | "email">) {
    try {
      const response = await this.user.create({data});
      return {success: true, data: response};
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          return {success: false, message: e.message};
        }
      }
      throw e
    }
  }

  async validateUser(where: Pick<User, "password" | "email">): Promise<boolean> {
    const user = await this.user.findFirst({where});

    if (user) {
      return true;
    }

    return false;
  }
}

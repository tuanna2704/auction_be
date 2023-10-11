import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, BidItemState, User } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  async createUser(data: Pick<User, "password" | "email" | "name">) {
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

  async findUser(where: Prisma.UserWhereInput): Promise<Pick<User, "password">> {
    const user = await this.user.findFirst({where});
    delete user.password;

    return user;
  }

  async createBidItem(data: Prisma.BidItemCreateInput) {
    try {
      const response = await this.bidItem.create({data});
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

  async findItems({ state, startTime, endTime }) {
    const items = await this.bidItem.findMany({
      where: {
        state,
        startTime: {
          gte: startTime ? new Date(startTime) : undefined,
        },
        endTime: {
          lte: endTime ? new Date(endTime) : undefined,
        }
      },
    })

    return items;
  }

  async publishItem({ id, userId }) {
    try {
      const response = await this.bidItem.update({
        where: { id: Number(id), userId },
        data: {
          state: BidItemState.PUBLISHED,
        }
      })
      return {success: true, data: response};
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2025') {
          return {success: false, message: e.meta.cause};
        }
      }
      throw e
    }
  }
}

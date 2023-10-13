import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, BidItemState, User, DepositEventType, DepositLockState } from '@prisma/client';

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

  async findUser(where: Prisma.UserWhereInput): Promise<Omit<User, "password">> {
    try {
      const user = await this.user.findFirst({where});
      if (user) {
        delete user.password;
        return user;
      }
      return null;
    } catch (e) {
      throw e
    }
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

  async findOngoingItems(endTime) {
    const items = await this.bidItem.findMany({
      where: {
        state: BidItemState.PUBLISHED,
        endTime: {
          gte: endTime ? new Date(endTime) : undefined,
        }
      },
      include: {
        depositLock: {
          orderBy: [{amount: 'desc'}],
          take: 1
        },
      }
    })
    return items;
  }

  async findCompletedItems(endTime) {
    const items = await this.bidItem.findMany({
      where: {
        state: BidItemState.PUBLISHED,
        endTime: {
          lt: endTime ? new Date(endTime) : undefined,
        }
      },
      include: {
        depositLock: {
          orderBy: [{amount: 'desc'}],
          take: 1
        },
      }
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

  async findItem(id: number) {
    const items = await this.bidItem.findFirst({
      where: {
        id
      },
    })

    return items;
  }

  async recharge(id: number, amount: number) {
    try {
      const response = await this.$transaction([
        this.user.update({
          where: { id },
          data: {
            deposit: {
              increment: amount
            },
            depositLogs: {
    
            }
          }
        }),
        this.depositLog.create({
          data: {
            amount, 
            userId: id,
            eventType: DepositEventType.RECHAGE
          }
        })
      ])

      return {success: true, data: {user: response[0], depositLog: response[1]}};
    } catch (e) {
      throw e
    }
  }

  findLogsByUser (id: number) {
    return this.depositLog.findMany({where: { userId: id}});
  }

  findOngoingItem(id: number) {
    return this.bidItem.findFirst({
      where: {
        id,
        state: BidItemState.PUBLISHED,
        startTime: {
          lte: new Date,
        },
      },
      include: {
        depositLock: {
          orderBy: [{amount: 'desc'}],
          take: 1
        },
      }
    })
  }

  async bid({amount, userId, itemId}) {
    try {
      const response = await this.$transaction([
        this.depositLock.create({data: {userId, itemId, amount, state: DepositLockState.LOCKED}}),
        this.user.update({
          where: { id: userId },
          data: { totalDepositLock: {increment: amount}}
        })
      ])

      return {success: true, data: response};
    } catch (e) {
      throw e
    }
  }
}

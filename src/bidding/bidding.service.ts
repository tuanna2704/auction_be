import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class BiddingService {
  constructor(
    private prisma: PrismaService,
  ) {}

  createItem(data: Prisma.BidItemCreateInput) {
    return this.prisma.createBidItem(data);
  }

  findItems({state, startTime, endTime}) {
    return this.prisma.findItems({state, startTime, endTime});
  }

  publishItem({id, userId}) {
    return this.prisma.publishItem({id, userId});
  }

  findItem(id: number) {
    return this.prisma.findItem(Number(id));
  }

  recharge({amount, userId}) {
    return this.prisma.recharge(userId, amount);
  }

  findLogs(id: number) {
    return this.prisma.findLogsByUser(id);
  }

  async bid({amount, user, itemId}: {amount: number, user: User, itemId: number}) {
    if (amount + user.totalDepositLock > user.deposit) {
      return {success: false, message: `Deposit is not enough! You need at least ${amount}`};
    }

    const onGoingItem = await this.prisma.findOngoingItem(itemId);
    if (!onGoingItem) {
      return {success: false, message: "Item is not on going!"};
    } 

    if (amount < onGoingItem.startPrice) {
      return {success: false, message: `Biding ammount must be greater than ${onGoingItem.startPrice}`};
    }

    return "this.prisma.bid({amount, userId: user.id, itemId});"
  }
}

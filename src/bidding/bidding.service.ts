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

  findOngoingItems(endTime) {
    return this.prisma.findOngoingItems(endTime);
  }

  findCompletedItems(endTime) {
    return this.prisma.findCompletedItems(endTime);
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

  async bid({amount, userId, itemId}: {amount: number, userId: number, itemId: number}) {
    const user = await this.prisma.findUser({ id: userId });

    if (!user) {
      return {success: false, message: `User not found`};
    }

    if (amount + user.totalDepositLock > user.deposit) {
      return {success: false, message: `Deposit is not enough! You need at least ${amount}`};
    }

    const onGoingItem = await this.prisma.findOngoingItem(itemId);
    const currentPrice = onGoingItem.depositLock[0]?.amount || onGoingItem.startPrice;
    if (!onGoingItem) {
      return {success: false, message: "Item is not on going!"};
    }

    if (amount < currentPrice) {
      return {success: false, message: `Current price is ${currentPrice}, You have to bid with amount greater than that`};
    }

    if (amount < onGoingItem.startPrice) {
      return {success: false, message: `Biding ammount must be greater than ${onGoingItem.startPrice}`};
    }

    return this.prisma.bid({amount, userId: user.id, itemId});
  }

  async finishBidding(itemId: number) {
    return await this.prisma.finishBidding(itemId);
  }
}

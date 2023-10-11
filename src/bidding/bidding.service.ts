import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
}

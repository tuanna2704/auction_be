import { Module } from '@nestjs/common';
import { BiddingController } from './bidding.controller';
import { BiddingService } from './bidding.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BiddingController],
  providers: [BiddingService, PrismaService]
})
export class BiddingModule {}

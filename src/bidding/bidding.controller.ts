import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { BiddingService } from './bidding.service';
import { User } from '@prisma/client';

@Controller('api/bidding')
export class BiddingController {
  constructor(
    private biddingsService: BiddingService
  ){}

  @UseGuards(AuthGuard)
  @Post('item/create')
  createItem(@Body('item') item, @Req() request: Request) {
    return this.biddingsService.createItem(
      {...item, ...{userId: (request['user'] as User).id}
    });
  }
}
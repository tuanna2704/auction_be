import { Controller, Post, Body, UseGuards, Req, Get, Query, Put, Param } from '@nestjs/common';
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

  @UseGuards(AuthGuard)
  @Put('item/:id/publish')
  publishItem(@Param('id') id: number, @Req() request: Request) {
    return this.biddingsService.publishItem({id, userId: (request['user'] as User).id})
  }
  
  @Get('item')
  @UseGuards(AuthGuard)
  listItems(
    @Query('state') state,
    @Query('startTime') startTime,
    @Query('endTime') endTime,
  ) {
    return this.biddingsService.findItems({state, startTime, endTime});
  }

  @Get('item/ongoing')
  @UseGuards(AuthGuard)
  listOngoingItems(
    @Query('endTime') endTime,
  ) {
    return this.biddingsService.findOngoingItems(endTime);
  }

  @Get('item/completed')
  @UseGuards(AuthGuard)
  listCompletedItems(
    @Query('endTime') endTime,
  ) {
    return this.biddingsService.findCompletedItems(endTime);
  }

  @Get('item/:id')
  @UseGuards(AuthGuard)
  findItem(
    @Param('id') id: number
  ) {
    return this.biddingsService.findItem(id);
  }

  @UseGuards(AuthGuard)
  @Post('/recharge')
  recharge(@Body('amount') amount: number, @Req() request: Request) {
    return this.biddingsService.recharge({amount, userId: (request['user'] as User).id})
  }

  @Get('user/:id/logs')
  @UseGuards(AuthGuard)
  getLogs(
    @Param('id') id: number
  ) {
    return this.biddingsService.findLogs(Number(id));
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  bid(
    @Body('amount') amount: number,
    @Body('itemId') itemId: number,
    @Req() request: Request
  ) {
    return this.biddingsService.bid({amount, userId: (request['user'] as User).id, itemId});
  }

  @UseGuards(AuthGuard)
  @Post('/finish')
  finishBidding(
    @Body('itemId') itemId: number,
  ) {
    return this.biddingsService.finishBidding(itemId);
  }
}

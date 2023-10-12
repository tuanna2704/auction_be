import { Controller, Post, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { AuthGuard } from './auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signUp(@Body('user') user: Pick<User, "password" | "email" | "name">) {
    return this.authService.signUp(user);
  }

  @Post('signin')
  signIn(@Body('user') user: Pick<User, "password" | "email" | "name">) {
    return this.authService.signIn(user);
  }

  @UseGuards(AuthGuard)
  @Post('info')
  info(@Body('id') id: number, @Req() request: Request) {
    return this.authService.userInfo(id || (request['user'] as User).id);
  }

  @Delete('signout')
  signOut(): string {
    return 'Not Implemented Yet';
  }
}

import { Controller, Post, Delete, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signUp(@Body('user') user: Pick<User, "password" | "email">) {
    return this.authService.signUp(user);
  }

  @Post('signin')
  signIn(@Body('user') user: Pick<User, "password" | "email">) {
    return this.authService.signIn(user);
  }

  @Delete('signout')
  signOut(): string {
    return 'this.authService.signOut(user)';
  }
}

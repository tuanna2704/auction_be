import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { SignInSuccess, SignInFailed } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  signUp(data: Pick<User, "password" | "email" | "name">) {
    return this.prisma.createUser(data);
  }

  async signIn({ email, password}: Pick<User, "password" | "email">): Promise<SignInSuccess | SignInFailed> {
    const user = await this.prisma.findUser({email, password});
    if (user) {
      const token = this.jwtService.sign(user);
      return { success: true, access_token: token};
    }

    return { success: false, message: 'Signed Failed' };
  }
}

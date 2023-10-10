import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { SignInSuccess, SignInFailed } from './auth.interface';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signUp(data: Pick<User, "password" | "email">) {
    return this.prisma.createUser(data);
  }

  async signIn({ email, password}: Pick<User, "password" | "email">): Promise<SignInSuccess | SignInFailed> {
    const result = this.prisma.validateUser({email, password})
    if (result) {
      return { success: true, token: 'jwt token'};
    }

    return { success: false, message: 'Signed Failed' };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SigninDto } from './dto/signin-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    userData: Omit<Prisma.UserCreateInput, 'image'> & { image: string },
  ) {
    const { image, ...rest } = userData;
    return await this.prisma.user.create({
      data: {
        ...rest,
        image: {
          create: {
            url: image,
          },
        },
      },
      include: {
        image: true,
      },
    });
  }

  async findUser(signinDto: SigninDto) {
    return this.prisma.user.findUnique({
      where: { email: signinDto.email },
    });
  }

  async findUserByEmail(email: string) {
    console.log('Finding user with email:', email);
    return this.prisma.user.findUnique({
      where: { email },
      include: { image: true },
    });
  }
}

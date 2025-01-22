import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SigninDto } from './dto/signin-user.dto';
import { Prisma } from '@prisma/client';
import { DeleteUserDto } from './dto/delete-user.dto';

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

  async updateUser(
    updateData: Omit<Prisma.UserUpdateInput, 'image' | 'userId'> & {
      image?: string;
      userId: number;
    },
  ) {
    const { name, image, userId } = updateData;

    return this.prisma.$transaction(async (tx) => {
      if (image) {
        await tx.image.updateMany({
          where: {
            userId,
            status: true,
          },
          data: {
            status: false,
          },
        });

        await tx.image.create({
          data: {
            url: image,
            userId,
            status: true,
          },
        });
      }

      return tx.user.update({
        where: { id: userId },
        data: { name },
        include: {
          image: {
            where: { status: true },
          },
        },
      });
    });
  }

  async deleteUser(deleteUserDto: DeleteUserDto) {
    const { userId } = deleteUserDto;

    return this.prisma.$transaction(async (tx) => {
      await tx.like.deleteMany({
        where: { userId },
      });
      await tx.comment.deleteMany({
        where: { userId },
      });
      await tx.image.deleteMany({
        where: { userId },
      });
      await tx.post.deleteMany({
        where: { userId },
      });
      return tx.user.delete({
        where: { id: userId },
      });
    });
  }
}

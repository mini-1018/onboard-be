import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class LikesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findLike(userId: number, postId: number) {
    return this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
  }

  async createLike(userId: number, postId: number) {
    return this.prisma.like.create({
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });
  }

  async deleteLike(userId: number, postId: number) {
    return this.prisma.like.delete({
      where: {
        userId_postId: { userId, postId },
      },
    });
  }

  async getLikeCount(postId: number) {
    return this.prisma.like.count({ where: { postId } });
  }
}

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPost(postData: Prisma.PostCreateInput) {
    return this.prisma.post.create({
      data: postData,
    });
  }

  updatePost(id: number, postData: Prisma.PostUpdateInput) {
    return this.prisma.post.update({
      where: { id },
      data: postData,
    });
  }

  async getPosts(queryParams: Prisma.PostFindManyArgs) {
    return this.prisma.post.findMany({
      ...queryParams,
      include: {
        user: { select: { id: true, name: true } },
        tags: { select: { name: true } },
        comments: true,
        likes: { select: { userId: true } },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        tags: { select: { name: true } },
        comments: true,
        likes: { select: { userId: true } },
        user: { select: { id: true, name: true } },
      },
    });
  }
}

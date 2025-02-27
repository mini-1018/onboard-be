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

  async deletePost(id: number) {
    return this.prisma.$transaction(async (tx) => {
      await tx.comment.deleteMany({
        where: { postId: id },
      });
      return tx.post.delete({
        where: { id },
      });
    });
  }

  async getPosts(queryParams: Prisma.PostFindManyArgs) {
    const [posts, totalCount] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        ...queryParams,
        include: {
          user: { select: { id: true, name: true } },
          tags: { select: { name: true } },
          comments: true,
          likes: { select: { userId: true } },
        },
      }),
      this.prisma.post.count({
        where: queryParams.where,
      }),
    ]);

    return {
      posts,
      totalCount,
    };
  }

  async getPostsByUserId(userId: number, queryParams: Prisma.PostFindManyArgs) {
    const [posts, totalCount] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        ...queryParams,
        where: {
          ...queryParams.where,
          userId,
        },
        include: {
          user: { select: { id: true, name: true } },
          tags: { select: { name: true } },
          comments: true,
          likes: { select: { userId: true } },
        },
      }),
      this.prisma.post.count({
        where: {
          ...queryParams.where,
          userId,
        },
      }),
    ]);

    return {
      posts,
      totalCount,
    };
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

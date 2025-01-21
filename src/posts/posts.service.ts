import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { GetPostsDto, PostOrderBy } from './dto/get-posts.dto';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  create(createPostDto: CreatePostDto, userId: number) {
    const postData = this.createPostData(createPostDto, userId);
    return this.postsRepository.createPost(postData);
  }

  async getPosts(query: GetPostsDto) {
    const queryParams = this.queryParams(query);
    const posts = await this.postsRepository.getPosts(queryParams);
    return this.formatPostsResponse(posts, query);
  }

  findOne(id: number) {
    return this.postsRepository.findOne(id);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  private createPostData(createPostDto: CreatePostDto, userId: number) {
    return {
      title: createPostDto.title,
      content: createPostDto.content,
      user: { connect: { id: userId || 1 } },
      tags: {
        connectOrCreate: createPostDto.tags.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      },
    };
  }

  private orderByOptions(
    orderBy: PostOrderBy,
  ): Prisma.PostOrderByWithRelationInput {
    const options = {
      [PostOrderBy.LATEST]: { createdAt: Prisma.SortOrder.desc },
      [PostOrderBy.OLDEST]: { createdAt: Prisma.SortOrder.asc },
      [PostOrderBy.LIKES]: {
        likes: {
          _count: Prisma.SortOrder.desc,
        },
      },
    };
    return options[orderBy];
  }

  private whereOptions(tag?: string, search?: string) {
    const where: Prisma.PostWhereInput = {};

    if (tag) {
      where.tags = { some: { name: tag } };
    }

    if (search === null) {
      return { id: -1 };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }
    return where;
  }

  private queryParams(query: GetPostsDto): Prisma.PostFindManyArgs {
    const { cursor, limit, tag, search, orderBy } = query;

    return {
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: this.whereOptions(tag, search),
      orderBy: this.orderByOptions(orderBy),
    };
  }

  private formatPostsResponse(posts: Post[], query: GetPostsDto) {
    const hasNextPage = posts.length > query.limit;
    const postsData = hasNextPage ? posts.slice(0, -1) : posts;

    return {
      data: postsData,
      hasNextPage,
      nextCursor: hasNextPage ? postsData[postsData.length - 1].id : undefined,
    };
  }
}

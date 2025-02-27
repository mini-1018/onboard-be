import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { GetPostsDto, PostOrderBy } from './dto/get-posts.dto';
import { Post, Prisma } from '@prisma/client';
import { CommentsService } from '@src/comments/comments.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { currentTime } from '@src/common/utils/time.util';
import { customError } from '@src/common/exceptions/customError';

export enum SearchType {
  ALL = 'all',
  SEARCH_ONLY = 'search',
}

@Injectable()
export class PostsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly postsRepository: PostsRepository,
    private readonly commentsService: CommentsService,
  ) {}

  async create(userId: number, createPostDto: CreatePostDto) {
    const postData = this.createPostData(userId, createPostDto);
    const newPost = await this.postsRepository.createPost(postData);
    await this.invalidatePostsCache();
    return newPost;
  }

  async getPosts(query: GetPostsDto) {
    const cacheKey = `posts:${JSON.stringify(query)}`;

    const cachedPosts = await this.cacheManager.get(cacheKey);
    if (cachedPosts) {
      return cachedPosts;
    }

    const queryParams = this.queryParams(query);
    const { posts, totalCount } =
      await this.postsRepository.getPosts(queryParams);

    const postsWithTime = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        createdAt: await this.currentTime(post.createdAt),
      })),
    );

    const response = {
      ...this.formatPostsResponse(postsWithTime, query),
      totalCount,
    };

    await this.cacheManager.set(cacheKey, response, 10 * 1000);
    return response;
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne(id);
    const postWithTime = {
      ...post,
      createdAt: await this.currentTime(post.createdAt),
    };
    const comments = await this.commentsService.findByPostId(id);
    return {
      ...postWithTime,
      comments,
    };
  }

  async getPostsByUserId(userId: number, query: GetPostsDto) {
    const queryParams = this.queryParams(query, SearchType.ALL);
    const { posts, totalCount } = await this.postsRepository.getPostsByUserId(
      userId,
      queryParams,
    );
    const postsWithTime = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        createdAt: await this.currentTime(post.createdAt),
      })),
    );
    return {
      ...this.formatPostsResponse(postsWithTime, query),
      totalCount,
    };
  }

  async update(userId: number, updatePostDto: UpdatePostDto) {
    const { id, ...rest } = updatePostDto;
    const post = await this.postsRepository.findOne(id);
    if (post.userId !== userId) {
      customError(403, '0001');
    }
    await this.invalidatePostsCache();
    const postData = this.patchPostData(rest);
    return this.postsRepository.updatePost(id, postData);
  }

  async remove(userId: number, id: number) {
    const post = await this.postsRepository.findOne(id);
    if (post.userId !== userId) {
      customError(403, '0001');
    }
    await this.invalidatePostsCache();
    return this.postsRepository.deletePost(id);
  }

  private patchPostData(rest) {
    return {
      title: rest.title,
      content: rest.content,
      tags: {
        connectOrCreate: rest.tags.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      },
    };
  }

  private createPostData(userId: number, createPostDto: CreatePostDto) {
    return {
      title: createPostDto.title,
      content: createPostDto.content,
      user: { connect: { id: userId } },
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

  private whereOptions(
    tag?: string,
    search?: string,
    searchType: SearchType = SearchType.SEARCH_ONLY,
  ) {
    const where: Prisma.PostWhereInput = {};

    if (tag) {
      where.tags = { some: { name: tag } };
    }

    if (searchType === SearchType.SEARCH_ONLY && search === '') {
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

  private queryParams(
    query: GetPostsDto,
    searchType?: SearchType,
  ): Prisma.PostFindManyArgs {
    const { cursor, limit, tag, search, orderBy } = query;

    return {
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: this.whereOptions(tag, search, searchType),
      orderBy: this.orderByOptions(orderBy),
    };
  }

  private formatPostsResponse(
    posts: (Omit<Post, 'createdAt'> & { createdAt: string })[],
    query: GetPostsDto,
  ) {
    const hasNextPage = posts.length > query.limit;
    const postsData = hasNextPage ? posts.slice(0, -1) : posts;

    return {
      data: postsData,
      hasNextPage,
      nextCursor: hasNextPage ? postsData[postsData.length - 1].id : undefined,
    };
  }

  private async invalidatePostsCache() {
    await this.cacheManager.del('posts:*'); // 전체 캐시 삭제
  }

  private async currentTime(createAt: Date | string) {
    const time = currentTime(createAt);
    return time;
  }
}

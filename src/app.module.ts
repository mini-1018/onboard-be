import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PostsModule } from './posts/posts.module';
import { ImagesModule } from './images/images.module';
import { TagsModule } from './tags/tags.module';
import { LikesModule } from './likes/likes.module';

import { CommentsModule } from './comments/comments.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 10,
      max: 100,
    }),
    UsersModule,
    PostsModule,
    ImagesModule,
    TagsModule,
    LikesModule,
    CommentsModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}

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
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxModule } from './outbox/outbox.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 10,
      max: 100,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    PostsModule,
    ImagesModule,
    TagsModule,
    LikesModule,
    CommentsModule,
    OutboxModule,
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

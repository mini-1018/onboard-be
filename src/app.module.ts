import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PostsModule } from './posts/posts.module';
import { ImagesModule } from './images/images.module';
import { TagsModule } from './tags/tags.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxModule } from './outbox/outbox.module';
import { AuthModule } from './auth.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { CustomThrottlerGuard } from './common/guard/throttler.guard';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 10,
      max: 100,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    ScheduleModule.forRoot(),
    UsersModule,
    PostsModule,
    ImagesModule,
    TagsModule,
    LikesModule,
    CommentsModule,
    OutboxModule,
    AuthModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}

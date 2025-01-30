import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PrismaModule } from '@src/prisma/prisma.module';
import { CommentsModule } from '@src/comments/comments.module';

@Module({
  imports: [PrismaModule, CommentsModule],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService],
})
export class PostsModule {}

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '@src/prisma/prisma.module';
import { PostsModule } from '@src/posts/posts.module';
import { CommentsModule } from '@src/comments/comments.module';
import { ImagesModule } from '@src/images/images.module';
@Module({
  imports: [PrismaModule, PostsModule, CommentsModule, ImagesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}

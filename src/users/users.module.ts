import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '@src/prisma/prisma.module';
import { ImagesService } from '@src/images/images.service';
import { PostsService } from '@src/posts/posts.service';
import { PostsRepository } from '@src/posts/posts.repository';
@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    ImagesService,
    PostsService,
    PostsRepository,
  ],
})
export class UsersModule {}

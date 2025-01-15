import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PostsModule } from './posts/posts.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [UsersModule, PostsModule, ImagesModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}

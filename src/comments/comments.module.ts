import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { PrismaService } from '@src/prisma/prisma.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, PrismaService],
  exports: [CommentsService],
})
export class CommentsModule {}

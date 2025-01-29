import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaModule } from '@src/prisma/prisma.module';
import { LikesRepository } from './likes.repository';

@Module({
  imports: [PrismaModule],
  controllers: [LikesController],
  providers: [LikesService, LikesRepository],
})
export class LikesModule {}

import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ImagesRepository } from './images.repository';
import { OutboxModule } from '@src/outbox/outbox.module';
@Module({
  imports: [OutboxModule],
  controllers: [ImagesController],
  providers: [ImagesService, ImagesRepository],
  exports: [ImagesService],
})
export class ImagesModule {}

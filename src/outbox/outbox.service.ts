import { Injectable } from '@nestjs/common';
import { OutboxRepository } from './outbox.repository';
import { Prisma } from '.prisma/client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class OutboxService {
  constructor(private readonly outboxRepository: OutboxRepository) {}

  async create(outbox: Prisma.OutboxCreateInput) {
    return this.outboxRepository.create(outbox);
  }

  async update(id: number, outbox: Prisma.OutboxUpdateInput) {
    return this.outboxRepository.update(id, outbox);
  }

  @Cron('0 0 * * *')
  async deleteSuccessOutbox() {
    return this.outboxRepository.deleteSuccessOutbox();
  }
}

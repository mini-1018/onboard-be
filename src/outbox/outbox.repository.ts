import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { Prisma } from '.prisma/client';

@Injectable()
export class OutboxRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(outbox: Prisma.OutboxCreateInput) {
    return this.prisma.outbox.create({
      data: outbox,
    });
  }

  update(id: number, outbox: Prisma.OutboxUpdateInput) {
    return this.prisma.outbox.update({
      where: { id },
      data: outbox,
    });
  }

  deleteSuccessOutbox() {
    return this.prisma.outbox.deleteMany({
      where: {
        status: 'SUCCESS',
      },
    });
  }
}

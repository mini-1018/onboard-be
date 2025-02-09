import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';

@Injectable()
export class ImagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findInvalidImages() {
    return this.prisma.image.findMany({
      where: {
        status: false,
      },
    });
  }

  async deleteImage(id: number) {
    return this.prisma.image.delete({
      where: {
        id,
      },
    });
  }
}

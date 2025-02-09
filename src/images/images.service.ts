import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import {
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  AWS_S3_REGION,
  AWS_S3_SECRET_KEY,
} from '@/env';
import { Cron } from '@nestjs/schedule';
import { ImagesRepository } from './images.repository';
import { OutboxService } from '@src/outbox/outbox.service';

@Injectable()
export class ImagesService {
  private s3Client: S3Client;

  constructor(
    private readonly imagesRepository: ImagesRepository,
    private readonly outboxService: OutboxService,
  ) {
    this.s3Client = new S3Client({
      region: AWS_S3_REGION,

      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY,
        secretAccessKey: AWS_S3_SECRET_KEY,
      },
    });
  }

  @Cron('0 0 * * *')
  async deleteInvalidImages() {
    try {
      const invalidImages = await this.imagesRepository.findInvalidImages();

      for (const image of invalidImages) {
        const outbox = await this.outboxService.create({
          payload: { image: image.url },
          eventType: 'DELETE_IMAGE',
          status: 'PENDING',
          retries: 0,
        });

        try {
          const fileName = image.url.split('/').pop();
          const key = `profiles/${fileName}`;
          const response = await this.s3Client.send(
            new DeleteObjectCommand({
              Bucket: AWS_S3_BUCKET_NAME,
              Key: key,
            }),
          );

          if (response.$metadata.httpStatusCode !== 204) {
            throw new Error(`Failed to delete from S3: ${key}`);
          }

          await this.imagesRepository.deleteImage(image.id);

          await this.outboxService.update(outbox.id, {
            status: 'SUCCESS',
          });
        } catch (error) {
          if (outbox.retries < 3) {
            await this.outboxService.update(outbox.id, {
              error: error.message,
              retries: outbox.retries + 1,
            });
          } else {
            await this.outboxService.update(outbox.id, {
              status: 'FAILED',
              error: error.message,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error deleting invalid images', error);
    }
  }

  async uploadImage(file: Express.Multer.File) {
    const key = `profiles/${Date.now()}-${file.originalname}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${key}`;
  }
}

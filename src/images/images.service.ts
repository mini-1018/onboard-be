import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import {
  AWS_S3_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  AWS_S3_SECRET_KEY,
} from '@src/env';
import { AWS_S3_REGION } from '@src/env';

@Injectable()
export class ImagesService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: AWS_S3_REGION,
      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY,
        secretAccessKey: AWS_S3_SECRET_KEY,
      },
    });
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

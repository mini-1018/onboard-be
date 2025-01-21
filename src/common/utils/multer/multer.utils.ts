import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return cb(
      new BadRequestException('지원하지 않는 이미지 형식입니다'),
      false,
    );
  }
  cb(null, true);
};

export const multerOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: imageFileFilter,
};

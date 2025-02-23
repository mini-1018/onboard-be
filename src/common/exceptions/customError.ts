import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';

export const customError = (status: number, errorCode: string) => {
  switch (status) {
    case 400:
      throw new BadRequestException(errorCode);
    case 401:
      throw new UnauthorizedException(errorCode);
    case 403:
      throw new ForbiddenException(errorCode);
    case 404:
      throw new NotFoundException(errorCode);
    case 409:
      throw new ConflictException(errorCode);
    case 422:
      throw new UnprocessableEntityException(errorCode);
    case 429:
      throw new HttpException({ message: errorCode }, 429);
    default:
      throw new InternalServerErrorException(errorCode);
  }
};

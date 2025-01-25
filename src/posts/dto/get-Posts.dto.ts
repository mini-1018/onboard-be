import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum PostOrderBy {
  LATEST = 'latest',
  OLDEST = 'oldest',
  LIKES = 'likes',
}

export class GetPostsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cursor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 20;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PostOrderBy)
  orderBy?: PostOrderBy = PostOrderBy.LATEST;
}

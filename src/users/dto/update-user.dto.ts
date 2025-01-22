import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;
}

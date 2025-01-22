import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;
}

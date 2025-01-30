import { Controller, Post, Param, Body } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId')
  toggleLike(@Param('postId') postId: string, @Body('userId') userId: number) {
    return this.likesService.toggleLike(+postId, userId);
  }
}

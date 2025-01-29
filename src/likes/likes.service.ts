import { Injectable } from '@nestjs/common';
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikesRepository) {}

  async toggleLike(postId: number, userId: number) {
    const existingLike = await this.likesRepository.findLike(userId, postId);
    console.log(existingLike);
    if (existingLike) {
      return this.likesRepository.deleteLike(userId, postId);
    }
    return this.likesRepository.createLike(userId, postId);
  }
}

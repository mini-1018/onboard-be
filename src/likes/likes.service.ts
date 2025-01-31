import { Injectable } from '@nestjs/common';
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikesRepository) {}

  async toggleLike(postId: number, userId: number) {
    const existingLike = await this.likesRepository.findLike(userId, postId);
    if (existingLike) {
      await this.likesRepository.deleteLike(userId, postId);
    } else {
      await this.likesRepository.createLike(userId, postId);
    }

    const likeCount = await this.likesRepository.getLikeCount(postId);

    return { likeCount, isLiked: !existingLike };
  }
}

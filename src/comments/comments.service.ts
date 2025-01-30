import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsRepository } from './comments.repository';
import { Comment } from '.prisma/client';

interface CommentWithUser extends Comment {
  user: {
    id: number;
    name: string;
    image: { url: string }[];
  };
}

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  create(createCommentDto: CreateCommentDto) {
    return this.commentsRepository.create(createCommentDto);
  }

  async findByPostId(postId: number) {
    const comments = await this.commentsRepository.findByPostId(postId);
    return this.buildCommentTree(comments);
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.commentsRepository.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentsRepository.remove(id);
  }

  private buildCommentTree(comments: CommentWithUser[]) {
    const commentMap = new Map();
    const roots = [];

    comments.forEach((comment) => {
      const imageUrl = comment.user.image?.[0].url || null;

      commentMap.set(comment.id, {
        ...comment,
        replies: [],
        user: {
          id: comment.user.id,
          name: comment.user.name,
          image: imageUrl,
        },
      });
    });

    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        roots.push(commentMap.get(comment.id));
      }
    });

    return roots;
  }
}

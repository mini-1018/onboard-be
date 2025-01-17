import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}
  create(createPostDto: CreatePostDto, userId: number) {
    const postData = {
      title: createPostDto.title,
      content: createPostDto.content,
      user: { connect: { id: userId || 1 } },
      tags: {
        connectOrCreate: createPostDto.tags.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        })),
      },
    };

    return this.postsRepository.createPost(postData);
  }

  findAll() {
    return this.postsRepository.findAll();
  }

  findOne(id: number) {
    return this.postsRepository.findOne(id);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}

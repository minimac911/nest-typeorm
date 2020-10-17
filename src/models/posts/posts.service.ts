import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostEntity } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    private readonly userService: UsersService,
  ) {}

  async getAll(relations: string[] = []): Promise<PostEntity[]> {
    return await this.postsRepository.find({ relations });
  }

  async getAllPublished(relations: string[] = []): Promise<PostEntity[]> {
    return await this.postsRepository.find({
      relations,
      where: { isPublished: true },
    });
  }

  async getOne(
    id: number,
    relations: string[] = [],
  ): Promise<PostEntity | null> {
    const post = await this.postsRepository.findOne(id, { relations });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async create(data: CreatePostDto): Promise<PostEntity | null> {
    const user = await this.userService.get(data.userId);

    if (!user) throw new NotFoundException('User not found');

    return await this.postsRepository.save({ ...data, user });
  }

  async publishPost(id: number): Promise<PostEntity> {
    const post = await this.postsRepository.findOne(id);

    if (!post) throw new NotFoundException('Post not found');

    post.isPublished = true;

    const publishedPost = await this.postsRepository.save(post);

    return publishedPost;
  }
}

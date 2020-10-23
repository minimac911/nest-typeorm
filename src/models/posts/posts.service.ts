import { Injectable, NotImplementedException } from '@nestjs/common';
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

  async getAll(): Promise<PostEntity[]> {
    const posts = await this.postsRepository.find();
    return posts;
  }

  async getAllPublished(): Promise<PostEntity[]> {
    throw new NotImplementedException();
  }

  async getOne(id: number): Promise<PostEntity | null> {
    throw new NotImplementedException();
  }

  async create(data: CreatePostDto): Promise<PostEntity | null> {
    throw new NotImplementedException();
  }

  async publishPost(id: number): Promise<PostEntity> {
    throw new NotImplementedException();
  }
}

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDefined } from 'class-validator';
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
    const posts = await this.postsRepository.find({
      where: { isPublished: true },
    });
    return posts;
  }

  async getOne(id: number): Promise<PostEntity> {
    const post = await this.postsRepository.findOne(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(data: CreatePostDto): Promise<PostEntity> {
    const { title, userId, isPublished, content } = data;

    const user = await this.userService.getById(userId).catch(e => {
      throw e;
    });

    const createPost = await this.postsRepository.create({
      title,
      content: isDefined(content) ? content : null,
      isPublished: isDefined(isPublished) ? isPublished : false,
      user,
    });

    const savePost = await this.postsRepository.save(createPost);

    return savePost;
  }

  async publishPost(id: number): Promise<PostEntity> {
    throw new NotImplementedException();
  }
}

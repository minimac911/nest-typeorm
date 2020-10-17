import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
  Body,
  ParseIntPipe,
  Param,
  Put,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { ViewPostDto } from './dto/view-post.dto';
import { plainToClass } from 'class-transformer';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async getAll(): Promise<ViewPostDto[]> {
    const posts = await this.postService.getAll();
    return plainToClass(ViewPostDto, posts);
  }
  
  @Post()
  @ApiBody({ type: CreatePostDto })
  async create(@Body() inputs: CreatePostDto): Promise<ViewPostDto> {
    const createPost = await this.postService.create(inputs);
    return plainToClass(ViewPostDto, createPost);
  }

  @Get('/published')
  async getPublished(): Promise<ViewPostDto[]> {
    const publishedPosts = await this.postService.getAllPublished();
    return plainToClass(ViewPostDto, publishedPosts);
  }

  @Get('/:id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<ViewPostDto> {
    const post = await this.postService.getOne(id);
    return plainToClass(ViewPostDto, post);
  }

  @Put('/:id/publish')
  async publishPost(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ViewPostDto> {
    const publishPost = await this.postService.publishPost(id);
    return plainToClass(ViewPostDto, publishPost);
  }

}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(readonly userService: UsersService) {}

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAll(): Promise<UserResponseDto[]> {
    const allUsers = await this.userService.getAll();
    return plainToClass(UserResponseDto, allUsers);
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    const user = await this.userService.getById(id);
    return plainToClass(UserResponseDto, user);
  }

  @Post('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: CreateUserDto })
  async create(@Body() inputs: CreateUserDto): Promise<UserResponseDto> {
    const createUser = await this.userService.create(inputs);
    return plainToClass(UserResponseDto, createUser);
  }

  @Put('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: EditUserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() inputs: EditUserDto,
  ): Promise<UserResponseDto> {
    const updateUser = await this.userService.updateUser(id, inputs);
    return plainToClass(UserResponseDto, updateUser);
  }
}

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import {
  extendedUserGroupsForSerializing,
  UserEntity,
} from './serializer/user.serializer';
import { UsersService } from './users.service';

@Controller('users')
@SerializeOptions({
  groups: extendedUserGroupsForSerializing,
})
export class UsersController {
  constructor(readonly userService: UsersService) {}

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Param('id') id): Promise<UserEntity> {
    return await this.userService.get(id);
  }

  @Post('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() inputs: CreateUserDto): Promise<UserEntity> {
    return await this.create(inputs);
  }

  @Put('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id') id,
    @Body() inputs: EditUserDto,
  ): Promise<UserEntity> {
    const user = await this.userService.get(id);
    return this.userService.update(user, inputs);
  }
}

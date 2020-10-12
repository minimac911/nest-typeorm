import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { UserEntity } from './serializer/user.serializer';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async get(
    id: string,
    relations: string[] = [],
    throwsException = false,
  ): Promise<UserEntity | null> {
    return await this.usersRepository.get(id, relations, throwsException);
  }

  async create(inputs: CreateUserDto): Promise<UserEntity> {
    return await this.usersRepository.createEntity(inputs);
  }

  async update(user: UserEntity, inputs: EditUserDto): Promise<UserEntity> {
    return await this.usersRepository.updateEntity(user, inputs);
  }
}

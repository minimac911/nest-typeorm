import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async get(id: number, relations: string[] = []): Promise<UserEntity | null> {
    return await this.usersRepository.findOne(id, { relations });
  }

  async getAll(relations: string[] = []): Promise<UserEntity[] | null> {
    return await this.usersRepository.find({ relations });
  }

  async create(inputs: CreateUserDto): Promise<UserEntity> {
    const createUser = await this.usersRepository.save(inputs);
    return createUser;
  }

  async updateUser(id: number, inputs: EditUserDto): Promise<UserEntity> {
    const foundUser = await this.usersRepository.findOne(id);

    if (!foundUser) throw new NotFoundException('User not found.');

    foundUser.email = inputs.email;
    foundUser.name = inputs.name;

    const updateUser = await this.usersRepository.save(foundUser);

    return updateUser;
  }
}

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  private logger = new Logger('UserService');

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
    const { name, email, password } = inputs;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = await this.usersRepository.create({
      name,
      email,
      salt,
      password: hashedPassword,
    });

    try {
      const result = await this.usersRepository.save(newUser);
      return result;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error.code === '23505') {
        // duplicate email
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateUser(id: number, inputs: EditUserDto): Promise<UserEntity> {
    const foundUser = await this.usersRepository.findOne(id);

    if (!foundUser) throw new NotFoundException('User not found.');

    foundUser.email = inputs.email;
    foundUser.name = inputs.name;

    const updateUser = await this.usersRepository.save(foundUser);

    return updateUser;
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const foundUser = await this.usersRepository.findOne({ email });

    if (!foundUser)
      throw new ConflictException(`User with email '${email}' does not exist`);

    return foundUser;
  }
}

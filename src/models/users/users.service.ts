import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { UserEntity } from './entities/user.entity';
import HashUtil from 'src/common/utils/hash.util';
import { isEmpty } from 'class-validator';

@Injectable()
export class UsersService {
  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly hashUtil: HashUtil,
  ) {}

  async get(id: number): Promise<UserEntity | null> {
    return await this.usersRepository.findOneOrFail(id);
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const foundUser = await this.usersRepository.findOneOrFail({ email });

    return foundUser;
  }

  async getAll(relations: string[] = []): Promise<UserEntity[] | null> {
    return await this.usersRepository.find({ relations });
  }

  async create(inputs: CreateUserDto): Promise<UserEntity> {
    const { name, email, password } = inputs;

    const foundUser = await this.usersRepository.findOne({ where: { email } });

    if (foundUser) throw new ConflictException('Email already exists');

    const { hash, salt } = await this.hashUtil.hashPassword(password);

    // create new user
    const newUser = await this.usersRepository.create({
      name,
      email,
      salt,
      password: hash,
    });

    const result = await this.usersRepository.save(newUser);
    return result;
  }

  async updateUser(id: number, inputs: EditUserDto): Promise<Boolean> {
    if (Object.keys(inputs).length === 0)
      throw new BadRequestException('No changes provided');

    const userExist = await this.usersRepository.findOneOrFail(id);
    if (!userExist) throw new NotFoundException('User not found');

    if (inputs.email) {
      const foundUser = await this.usersRepository.findOne({
        where: { email: inputs.email },
      });

      if (foundUser) throw new ConflictException('Email already exists');
    }

    try {
      await this.usersRepository.update(id, {
        email: inputs.email,
        name: inputs.name,
      });

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindConditions, FindOneOptions, ObjectID, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../users.service';
import { internet, name } from 'faker';
import { ConflictException } from '@nestjs/common';
import { UsersTestData } from './data/UsersTestData';
//https://github.com/mutoe/nestjs-realworld-example-app/blob/master/src/user/user.service.spec.ts

describe('UserService', () => {
  let userService: UsersService;
  let userRepository: Repository<UserEntity>;

  let findOne: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserEntity],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne,
            create: jest.fn(user => user),
            save: jest.fn(user => {
              if (UsersTestData.find(u => u.id === user.id))
                throw new ConflictException('Email already exists');
              return user;
            }),
          },
        },
      ],
    }).compile();

    userService = module.get(UsersService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('get', () => {
    beforeAll(async () => {
      findOne = await jest.fn(
        (
          id?: string | number | Date | ObjectID,
          options?: FindOneOptions<UserEntity>,
        ) => {
          const user = UsersTestData.find(u => u.id === id);
          if (!user) throw new ConflictException('User does not exist');
          return user;
        },
      );
    });

    it('should return a single user if the user id exists', async () => {
      const id = 1;
      const relations = [];

      await userService.get(id, relations);

      expect(userRepository.findOne).toBeCalledWith(id, { relations });
    });

    it('should throw an error if the user id does not exist', async () => {
      const id = -1;
      const relations = [];

      let _err = false;
      try {
        await userService.get(id, relations);
      } catch (error) {
        _err = true;
      }

      expect(_err).toBeTruthy();
    });
  });

  describe('create user', () => {
    it('should create a user correctly', async () => {
      const user: CreateUserDto = {
        email: internet.email(),
        name: name.findName(),
        password: internet.password(8),
      };

      const createdUser: UserEntity = await userService.create(user);

      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();

      expect(userRepository.create).toBeDefined;
      expect(userRepository.save).toBeDefined;

      expect(typeof createdUser.password).toBe('string');
      expect(typeof createdUser.salt).toBe('string');
    });

    it('should not allow 2 users with the same email', async () => {
      const user: CreateUserDto = {
        email: 'test@test.com',
        name: name.findName(),
        password: internet.password(8),
      };

      await userService.create(user);

      expect(userRepository.save).toThrowError();
    });
  });

  describe('get user by email', () => {
    findOne = jest.fn((options: FindConditions<UserEntity>) => {
      const user = UsersTestData.find(u => {
        if (u.email === options.email) return u;
      });
      if (!user) throw new ConflictException('User does not exist');
      return user;
    });
    it('should return a single user', async () => {
      const email = 'test@test.com';

      await userService.getByEmail(email);

      expect(userRepository.findOne).toBeCalledWith({ email });
    });

    it('should throw an error if user not found', async () => {
      const email = 'random@test.com';
      let _err = false;
      try {
        await userService.getByEmail(email);
      } catch (error) {
        _err = true;
      }
      expect(_err).toBeTruthy();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../users.service';
import HashUtil, { HashSaltResponse } from 'src/common/utils/hash.util';
import { ConflictException } from '@nestjs/common';
import { not } from '@hapi/joi';
//https://github.com/mutoe/nestjs-realworld-example-app/blob/master/src/user/user.service.spec.ts

const testEmail = 'test@test.com';
const testPassword = 'password';
const testSalt = 'salt';
const testName = 'test';

const userArray = [
  new UserEntity(testEmail, testPassword, testSalt, testName),
  new UserEntity('test2@gmail.com', 'password', 'salt', 'test2'),
  new UserEntity('test3@gmail.com', 'password', 'salt', 'test2'),
];

const oneUser = new UserEntity(testEmail, testPassword, testSalt, testName);

describe('UserService', () => {
  let userService: UsersService;
  let userRepository: Repository<UserEntity>;
  let hashUtil: HashUtil;

  let find: jest.Mock = jest.fn().mockReturnValue(userArray);
  let findOne = jest.fn().mockReturnValue(oneUser);
  let findOneOrFail = jest.fn().mockReturnValue(oneUser);
  let create = jest.fn(u => u);
  let save = jest.fn(u => u);
  let update = jest.fn(u => u);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find,
            findOne,
            findOneOrFail,
            create,
            save,
            update,
          },
        },
        {
          provide: HashUtil,
          useValue: {
            hashPassword: jest
              .fn()
              .mockReturnValue(new HashSaltResponse(testPassword, testSalt)),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    hashUtil = module.get<HashUtil>(HashUtil);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('get', () => {
    it('should return a single user if the user id exists', async () => {
      const testId = 1;
      const repoSpy = jest.spyOn(userRepository, 'findOneOrFail');
      expect(userService.get(testId)).resolves.toEqual(oneUser);
      expect(userRepository.findOneOrFail).toBeCalledWith(testId);
    });
  });

  describe('getByEmail', () => {
    it('should return a single user', async () => {
      const repoSpy = jest.spyOn(userRepository, 'findOneOrFail');
      expect(userService.getByEmail(testEmail)).resolves.toEqual(oneUser);
      expect(repoSpy).toBeCalledWith({ email: testEmail });
    });
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      expect(userService.getAll()).resolves.toEqual(userArray);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      findOne.mockReturnValueOnce(false);

      const user = await userService.create({
        email: testEmail,
        name: testName,
        password: testPassword,
      });

      expect(user).toEqual(oneUser);

      expect(hashUtil.hashPassword).toBeCalledWith(testPassword);

      expect(userRepository.create).toBeCalledWith(oneUser);
      expect(userRepository.save).toBeCalledWith(oneUser);
    });

    it('should not create a user if the email already exists', async () => {
      findOne.mockReturnValueOnce(oneUser);

      try {
        await userService.create({
          email: testEmail,
          name: testName,
          password: testPassword,
        });
      } catch (err) {
        expect(err).toBeDefined();
      }

      expect(userRepository.findOne).toBeCalledWith({
        where: { email: testEmail },
      });

      expect(userRepository.create).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    const testUpdateName = 'upName';
    const testUpdateEmail = 'upEmail@email.com';
    const testUpdateUser = { ...oneUser };

    describe('and the user does exist', () => {
      it('should update a user if name and email are updated', async () => {
        findOne.mockReturnValueOnce(false);

        testUpdateUser.email = testUpdateEmail;
        testUpdateUser.name = testUpdateName;

        const testId = 1;

        const updatedUser = await userService.updateUser(testId, {
          name: testUpdateName,
          email: testUpdateEmail,
        });

        expect(updatedUser).toBeTruthy();

        // check to see if the user exists
        expect(userRepository.findOneOrFail).toBeCalledWith(testId);

        // find user with email
        expect(userRepository.findOne).toBeCalledWith({
          where: { email: testEmail },
        });

        // update call
        expect(userRepository.update).toBeCalledWith(testId, {
          name: testUpdateName,
          email: testUpdateEmail,
        });
      });

      it('should update a user if just the name is provided', async () => {
        findOne.mockReturnValueOnce(false);

        testUpdateUser.name = testUpdateName;

        const testId = 1;

        const updatedUser = await userService.updateUser(testId, {
          name: testUpdateName,
        });

        expect(updatedUser).toBeTruthy();

        // check to see if the user exists
        expect(userRepository.findOneOrFail).toBeCalledWith(testId);

        // update call
        expect(userRepository.update).toBeCalledWith(testId, {
          name: testUpdateName,
        });
      });

      it('should update a user if just the email is provided', async () => {
        findOne.mockReturnValueOnce(false);

        testUpdateUser.email = testUpdateEmail;

        const testId = 1;

        const updatedUser = await userService.updateUser(testId, {
          email: testUpdateEmail,
        });

        expect(updatedUser).toBeTruthy();

        // check to see if the user exists
        expect(userRepository.findOneOrFail).toBeCalledWith(testId);

        // find user with email
        expect(userRepository.findOne).toBeCalledWith({
          where: { email: testEmail },
        });

        // update call
        expect(userRepository.update).toBeCalledWith(testId, {
          name: testUpdateName,
        });
      });

      it('should throw an error if the new email already exists', async () => {
        const testId = 1;

        expect.assertions(1);
        try {
          await userService.updateUser(testId, {});
        } catch (error) {
          expect(error.message).toEqual('No changes provided');
        }
      });

      it('should throw an error if the new email already exists', async () => {
        findOne.mockReturnValueOnce(oneUser);

        const testId = 1;

        try {
          await userService.updateUser(testId, {
            name: testUpdateName,
            email: testUpdateEmail,
          });
        } catch (error) {
          expect(error).toMatch('Email already exists');
        }
      });
    });
    describe('and the user does not exist', () => {
      it('should throw an error if the user does not exist', async () => {
        findOneOrFail.mockReturnValueOnce(false);

        const testId = 1;

        expect.assertions(1);

        try {
          await userService.updateUser(testId, {});
        } catch (error) {
          expect(error).toMatch('User not found');
        }
      });
    });
  });
});

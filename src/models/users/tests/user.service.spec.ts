import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../users.service';
import HashUtil, { HashSaltResponse } from 'src/common/utils/hash.util';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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

  let find: jest.Mock;
  let findOne: jest.Mock;
  let findOneOrFail: jest.Mock;
  let create: jest.Mock;
  let save: jest.Mock;
  let update: jest.Mock;

  beforeEach(async () => {
    find = jest.fn().mockReturnValue(userArray);
    findOne = jest.fn().mockReturnValue(oneUser);
    findOneOrFail = jest.fn().mockReturnValue(oneUser);
    create = jest.fn(u => u);
    save = jest.fn(u => u);
    update = jest.fn(u => u);

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
    expect(hashUtil).toBeDefined();
  });

  describe('getById', () => {
    it('should return a single user if the user id exists', async () => {
      const testId = 1;
      expect(userService.getById(testId)).resolves.toEqual(oneUser);
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
      expect.assertions(3);
      try {
        await userService.create({
          email: testEmail,
          name: testName,
          password: testPassword,
        });
      } catch (err) {
        expect(err.message).toEqual('Email already exists');
        expect(userRepository.findOne).toBeCalledWith({
          where: { email: testEmail },
        });
        expect(userRepository.create).not.toBeCalled();
      }
    });
  });

  describe('updateUser', () => {
    let testUpdateName;
    let testUpdateEmail;
    let testUpdateUser;

    beforeEach(() => {
      testUpdateName = 'upName';
      testUpdateEmail = 'upEmail@email.com';
      testUpdateUser = { ...oneUser };

      findOne.mockReturnValue(false);
    });

    describe('and the user does exist', () => {
      it('should update a user if a new name and email are present', async () => {
        findOne.mockReturnValueOnce(false);

        testUpdateUser.email = testUpdateEmail;
        testUpdateUser.name = testUpdateName;

        const testId = 1;

        const updatedUser = await userService.updateUser(testId, {
          name: testUpdateName,
          email: testUpdateEmail,
        });

        expect.assertions(4);

        expect(updatedUser).toBeTruthy();

        // check to see if the user exists
        expect(userRepository.findOneOrFail).toBeCalledWith(testId);

        // find user with email
        expect(userRepository.findOne).toBeCalledWith({
          where: { id: Not(testId), email: testUpdateEmail },
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

        expect.assertions(4);

        expect(updatedUser).toBeTruthy();

        // check to see if the user exists
        expect(userRepository.findOneOrFail).toBeCalledWith(testId);

        // find user with email
        expect(userRepository.findOne).toBeCalledWith({
          where: { id: Not(testId), email: testUpdateEmail },
        });

        // update call
        expect(userRepository.update).toBeCalledWith(testId, {
          email: testUpdateEmail,
        });
      });

      it('should throw a BadRequestException if no changes are provided', async () => {
        const testId = 1;

        expect.assertions(2);
        try {
          await userService.updateUser(testId, {});
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toEqual('No changes provided');
        }
      });

      it('should throw a ConflictException if the new email already exists', async () => {
        findOne.mockReturnValue(oneUser);

        const testId = 1;

        expect.assertions(2);

        try {
          await userService.updateUser(testId, {
            name: testUpdateName,
            email: testUpdateEmail,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toBe('Email already exists');
        }
      });

      it('should throw an error if update fails', async () => {
        update.mockRejectedValue('Update error');

        const testId = 1;

        expect.assertions(2);

        try {
          await userService.updateUser(testId, {
            name: testUpdateName,
            email: testUpdateEmail,
          });
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Update error');
        }
      });
    });

    describe('and the user does not exist', () => {
      it('should throw a NotFoundException if the user does not exist', async () => {
        findOneOrFail.mockReturnValueOnce(false);

        const testId = 1;

        expect.assertions(2);

        try {
          await userService.updateUser(testId, { name: testUpdateName });
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe('User not found');
        }
      });
    });
  });
});

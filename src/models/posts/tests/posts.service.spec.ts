// https://stackoverflow.com/questions/57099863/spyon-typeorm-repository-to-change-the-return-value-for-unit-testing-nestjs

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { UsersService } from 'src/models/users/users.service';
import { FindManyOptions, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostEntity } from '../entities/post.entity';
import { PostsService } from '../posts.service';

class PostTestData {
  title: string;
  content?: string = null;
  isPublished: boolean;
  user: UserEntity;
}

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

const testData: PostTestData = {
  title: 'test title',
  content: 'this is a lot of good content',
  isPublished: false,
  user: oneUser,
};

const onePost = new PostEntity(
  testData.title,
  testData.content,
  testData.isPublished,
  testData.user,
);

const postsArray = [
  onePost,
  new PostEntity('a', null, true, testData.user),
  new PostEntity('b', null, false, userArray[1]),
  new PostEntity('c', null, true, userArray[1]),
];

describe('PostsService', () => {
  let postService: PostsService;
  let postRepository: Repository<PostEntity>;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(postsArray),
            findOne: jest.fn().mockResolvedValue(onePost),
            findOneOrFail: jest.fn().mockResolvedValue(onePost),
            create: jest.fn(p => Promise.resolve(p)),
            save: jest.fn(p => Promise.resolve(p)),
            update: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getById: jest.fn().mockResolvedValue(oneUser),
          } as Partial<UsersService>,
        },
      ],
    }).compile();

    postService = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<PostEntity>>(
      getRepositoryToken(PostEntity),
    );
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
    expect(postRepository).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('getAll', () => {
    it('should get all posts', async () => {
      await expect(postService.getAll()).resolves.toBe(postsArray);
    });
  });

  describe('getAllPublished', () => {
    it('should get all posts that are published', async () => {
      const publishedPosts: PostEntity[] = [
        new PostEntity('a', null, true, testData.user),
        new PostEntity('c', null, true, userArray[1]),
      ];

      jest.spyOn(postRepository, 'find').mockResolvedValue(publishedPosts);

      expect.assertions(2);

      await expect(postService.getAllPublished()).resolves.toBe(publishedPosts);

      expect(postRepository.find).toBeCalledWith({
        where: { isPublished: true },
      } as FindManyOptions<PostEntity>);
    });
  });

  describe('getOne', () => {
    it('should get a single post given an ID', async () => {
      const testId = 1;

      expect.assertions(2);

      await expect(postService.getOne(testId)).resolves.toEqual(onePost);
      expect(postRepository.findOne).toBeCalledWith(testId);
    });

    it('should throw an error if the post does not exist', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);
      const testId = 1;
      expect.assertions(2);
      try {
        await postService.getOne(testId);
      } catch (error) {
        expect(postRepository.findOne).toBeCalledWith(testId);
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('createPost', () => {
    describe('and data is valid', () => {
      it('should create a post', async () => {
        const dto: CreatePostDto = {
          title: testData.title,
          content: testData.content,
          isPublished: testData.isPublished,
          userId: testData.user.id,
        };

        await expect(postService.create(dto)).resolves.toEqual(onePost);
        expect(postRepository.create).toBeCalledWith(onePost);
        expect(postRepository.save).toBeCalledWith(onePost);
      });
      it('should create a post if their is no body', async () => {
        const dto: CreatePostDto = {
          title: testData.title,
          content: null,
          isPublished: testData.isPublished,
          userId: testData.user.id,
        };

        const testPost = onePost;
        testPost.content = null;

        await expect(postService.create(dto)).resolves.toEqual(testPost);
        expect(postRepository.create).toBeCalledWith(testPost);
        expect(postRepository.save).toBeCalledWith(testPost);
      });

      it('should throw a NotFoundException if the user does not exist', async () => {
        jest
          .spyOn(userService, 'getById')
          .mockRejectedValue(new NotFoundException());

        const dto: CreatePostDto = {
          title: testData.title,
          content: testData.content,
          isPublished: testData.isPublished,
          userId: testData.user.id,
        };

        expect.assertions(2);

        try {
          await postService.create(dto);
        } catch (error) {
          expect(userService.getById).toBeCalledWith(dto.userId);
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });

    describe('and the data in not valid', () => {
      test.todo('should throw an error');
    });
  });

  describe('publishPost', () => {
    test.todo('should update a post to be published');
  });

  describe('updatePost', () => {
    test.todo('should update the post if the content and title are changed');
    test.todo('should update the post if the content is changed');
    test.todo('should update the post if the title are changed');
    test.todo('should not allow a user to update a post that is not theirs');
  });
});

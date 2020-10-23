// https://stackoverflow.com/questions/57099863/spyon-typeorm-repository-to-change-the-return-value-for-unit-testing-nestjs

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { UsersModule } from 'src/models/users/users.module';
import { UsersService } from 'src/models/users/users.service';
import { FindConditions, FindManyOptions, Repository } from 'typeorm';
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

  let find: jest.Mock;
  let findOne: jest.Mock;
  let findOneOrFail: jest.Mock;
  let create: jest.Mock;
  let update: jest.Mock;
  let save: jest.Mock;

  beforeEach(async () => {
    find = jest.fn().mockReturnValue(postsArray);
    findOne = jest.fn().mockReturnValue(onePost);
    findOneOrFail = jest.fn().mockReturnValue(onePost);
    create = jest.fn(p => p);
    save = jest.fn(p => p);
    update = jest.fn(p => p);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: {
            find,
            findOne,
            findOneOrFail,
            create,
            save,
            update,
          } as Partial<Repository<PostEntity>>,
        },
        {
          provide: UsersService,
          useValue: {
            getAll: jest.fn(),
            get: jest.fn(),
          } as Partial<UsersService>,
        },
      ],
    }).compile();

    postService = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<PostEntity>>(
      getRepositoryToken(PostEntity),
    );
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
    expect(postRepository).toBeDefined();
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

      find.mockReturnValue(publishedPosts);

      expect.assertions(2);

      await expect(postService.getAllPublished()).resolves.toBe(publishedPosts);

      expect(postRepository.find).toBeCalledWith({
        where: { isPublished: true },
      } as FindManyOptions<PostEntity>);
    });
  });

  describe('getOne', () => {
    test.todo('should get a single post given an ID');

    test.todo('should throw an error if the post does not exist');
  });

  describe('createPost', () => {
    describe('and data is valid', () => {
      test.todo('should create a post');
      test.todo('should create a post if their is no body');
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

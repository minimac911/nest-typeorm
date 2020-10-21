import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { Repository } from 'typeorm';
import { PostEntity } from '../entities/post.entity';
import { PostsService } from '../posts.service';
// https://stackoverflow.com/questions/57099863/spyon-typeorm-repository-to-change-the-return-value-for-unit-testing-nestjs

describe('PostsService', () => {
  let service: PostsService;
  let repo: Repository<PostEntity>;
  const mockPostsRepository = () => ({
    createProduct: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repo = module.get<Repository<PostEntity>>(getRepositoryToken(PostEntity));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for getAll', async () => {
    // mock file for reuse
    // notice we are pulling the repo variable and using jest.spyOn with no issues
    // jest.spyOn(repo, 'find').mockResolvedValueOnce([testPost]);
    // expect(await service.getAll()).toEqual([testPost]);
  });
});

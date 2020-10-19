// import { Test, TestingModule } from '@nestjs/testing';
// import { PostEntity } from './entities/post.entity';
// import { PostsService } from './posts.service';
// // https://www.carloscaballero.io/part-9-clock-in-out-system-testing-backend-unit-test-services/
// describe('Posts Service', () => {
//   let testingModule: TestingModule;
//   let service: PostsService;
//   // let spyAuthService: AuthService;
//   // let spyUserService: UserService;

//   beforeEach(async () => {
//     testingModule = await Test.createTestingModule({
//       providers: [PostsService],
//     }).compile();

//     service = testingModule.get(PostsService);
//     // spyAuthService = testingModule.get(AuthService);
//     // spyUserService = testingModule.get(UserService);
//   });

//   describe('when a post has been added', () => {
//     describe('and the post is valid', () => {
//       let post: PostEntity;
//       beforeEach(() => {
//         user = new User();
//         findOne.mockReturnValue(Promise.resolve(user));
//       });
//       it('should return the user', async () => {
//         const fetchedUser = await usersService.getByEmail('test@test.com');
//         expect(fetchedUser).toEqual(user);
//       });
//     });
//   });
// });

import { UserEntity } from '../../entities/user.entity';

export const UsersTestData: Partial<UserEntity>[] = [
  {
    id: 1,
    email: 'test@test.com',
    name: 'string',
    password: '$2a$10$TAZgvXwZMq3CHnc2P5d7z.ikpTkr6maI5wODOftnp73UPyg/jkVQK',
    salt: '$2a$10$TAZgvXwZMq3CHnc2P5d7z.',
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  },
];

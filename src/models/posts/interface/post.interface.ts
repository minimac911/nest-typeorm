import { UserEntity } from 'src/models/users/entities/user.entity';

export interface IPost {
  title: string;
  content: null | string;
  isPublished: boolean;
  user: UserEntity;
}

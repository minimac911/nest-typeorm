import { classToPlain, plainToClass } from 'class-transformer';
import { EntityRepository } from 'typeorm';
import { ModelRepository } from '../model.repository';
import { User } from './entities/user.entity';
import {
  allUserGroupsForSerializing,
  UserEntity,
} from './serializer/user.serializer';

@EntityRepository(User)
export class UsersRepository extends ModelRepository<User, UserEntity> {
  /**
   * Transform
   * @param model
   */
  transform(model: User): UserEntity {
    const transformOptions = { groups: allUserGroupsForSerializing };

    return plainToClass(
      UserEntity,
      classToPlain(model, transformOptions),
      transformOptions,
    );
  }

  /**
   * Transform many
   * @param models
   */
  transformMany(models: User[]): UserEntity[] {
    return models.map(model => this.transform(model));
  }
}

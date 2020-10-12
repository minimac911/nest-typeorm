import { NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ModelEntity } from 'src/common/serializers/model.serializer';
import { DeepPartial, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class ModelRepository<T, K extends ModelEntity> extends Repository<T> {
  /**
   * Basic get function
   * @param id Id to get
   * @param relations Relations
   * @param throwsException Any Exceptions
   */
  async get(
    id: string,
    relations: string[] = [],
    throwsException = false,
  ): Promise<K | null> {
    // Get one with the id and relations
    return await this.findOne({ where: { id }, relations })
      .then(entity => {
        // if there is no entity and throws an exception
        if (!entity && throwsException) {
          // reject promise and return exception
          return Promise.reject(new NotFoundException('Model Not Found'));
        }
        // return transformed promise
        return Promise.resolve(entity ? this.transform(entity) : null);
      })
      .catch(error => Promise.reject(error));
  }

  /**
   * Created Entity
   * @param inputs
   * @param relations
   */
  async createEntity(
    inputs: DeepPartial<T>,
    relations: string[] = [],
  ): Promise<K> {
    return this.save(inputs)
      .then(async entity => await this.get((entity as any).id, relations))
      .catch(error => Promise.reject(error));
  }

  /**
   * Update entity
   * @param entity
   * @param inputs
   * @param relations
   */
  async updateEntity(
    entity: K,
    inputs: QueryDeepPartialEntity<T>,
    relations: string[] = [],
  ): Promise<K> {
    return this.update(entity.id, inputs)
      .then(async () => await this.get(entity.id, relations))
      .catch(error => Promise.reject(error));
  }

  transform(model: T, transformOptions = {}): K {
    return plainToClass(ModelEntity, model, transformOptions) as K;
  }

  transformMany(models: T[], transformOptions = {}): K[] {
    return models.map(model => this.transform(model, transformOptions));
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { PostgresDatabaseConfigModule } from './postgres/config.module';
import { PostgresDatabaseConfigService } from './postgres/config.service';
/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgresDatabaseConfigModule],
      useFactory: async (
        postgresDatabaseConfigService: PostgresDatabaseConfigService,
      ) => ({
        ...postgresDatabaseConfigService.getTypeOrmConfig(),
      }),
      inject: [PostgresDatabaseConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class DatabaseConfigModule {
  constructor(private connection: Connection) {}
}

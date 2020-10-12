import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const config: TypeOrmModuleOptions = process.env.PRODUCTION
  ? {
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [process.env.TYPEORM_ENTITIES],
      synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
      logging: Boolean(process.env.TYPEORM_LOGGING),
      migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME,
      migrationsRun: Boolean(process.env.TYPEORM_MIGRATIONS_RUN),
      migrations: [process.env.TYPEORM_MIGRATIONS],
      cli: {
        migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
      },
    }
  : {
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [process.env.TYPEORM_ENTITIES],
      synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
      logging: Boolean(process.env.TYPEORM_LOGGING),
      migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME,
      migrationsRun: Boolean(process.env.TYPEORM_MIGRATIONS_RUN),
      migrations: [process.env.TYPEORM_MIGRATIONS],
      cli: {
        migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
      },
    };

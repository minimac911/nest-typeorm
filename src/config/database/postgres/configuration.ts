import { registerAs } from '@nestjs/config';
export default registerAs('database', () => ({
  connection: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: process.env.TYPEORM_PORT,
  synchronize: process.env.TYPEORM_SYNCHRONIZE,
  logging: process.env.TYPEORM_LOGGING,
  entities: process.env.TYPEORM_ENTITIES,
  migrations: process.env.TYPEORM_MIGRATIONS,
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN,
  migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME,
  migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,

  databaseTest: process.env.TYPEORM_DATABASE_TEST,
}));

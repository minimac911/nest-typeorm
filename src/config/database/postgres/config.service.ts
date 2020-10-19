import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from '../../app/config.service';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class PostgresDatabaseConfigService {
  constructor(
    private configService: ConfigService,
    private appConfigService: AppConfigService,
  ) {}

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    switch (this.appConfigService.env) {
      case 'production':
        break;
      case 'development':
        return {
          type: 'postgres',
          host: this.configService.get<string>('database.host'),
          port: this.configService.get<number>('database.port'),
          username: this.configService.get<string>('database.username'),
          password: this.configService.get<string>('database.password'),
          database: this.configService.get<string>('database.database'),
          entities: [this.configService.get<string>('database.entities')],
          synchronize: this.configService.get<boolean>('database.synchronize'),
          logging: this.configService.get<boolean>('database.logging'),
          migrationsTableName: this.configService.get<string>(
            'database.migrationsTableName',
          ),
          migrationsRun: this.configService.get<boolean>(
            'database.migrationsRun',
          ),
          migrations: [this.configService.get<string>('database.migrations')],
          cli: {
            migrationsDir: this.configService.get<string>(
              'database.migrationsDir',
            ),
          },
        };
      case 'test':
        return {
          type: 'postgres',
          host: this.configService.get<string>('database.host'),
          port: this.configService.get<number>('database.port'),
          username: this.configService.get<string>('database.username'),
          password: this.configService.get<string>('database.password'),
          database: this.configService.get<string>('database.databaseTest'),
          entities: [this.configService.get<string>('database.entities')],
          synchronize: true,
          logging: false,
          dropSchema: true,
          migrationsTableName: this.configService.get<string>(
            'database.migrationsTableName',
          ),
          migrationsRun: this.configService.get<boolean>(
            'database.migrationsRun',
          ),
          migrations: [this.configService.get<string>('database.migrations')],
          cli: {
            migrationsDir: this.configService.get<string>(
              'database.migrationsDir',
            ),
          },
        };
      default:
        return null;
    }
  }
}

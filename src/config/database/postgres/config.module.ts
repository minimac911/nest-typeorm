import { Module } from '@nestjs/common';
import configuration from './configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgresDatabaseConfigService } from './config.service';
import { AppConfigModule } from 'src/config/app/config.module';
/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AppConfigModule,
  ],
  providers: [ConfigService, PostgresDatabaseConfigService],
  exports: [ConfigService, PostgresDatabaseConfigService],
})
export class PostgresDatabaseConfigModule {}

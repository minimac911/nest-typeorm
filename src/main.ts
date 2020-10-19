import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from './config/app/config.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * Global auto validation
   */
  app.useGlobalPipes(new ValidationPipe());

  /**
   * Global Middleware
   */
  app.use(LoggerMiddleware);

  /**
   * Global filters
   */
  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * Swagger API docs UI
   */
  const options = new DocumentBuilder()
    .setTitle('Nest js type orm sandbox')
    .setDescription('This is the API docs for the nest js and typeorm sandbox')
    .setVersion('1.0')
    .addTag('nest-typeorm')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  /**
   * Config
   */

  const appConfig: AppConfigService = app.get('AppConfigService');

  await app.listen(appConfig.port);
}
bootstrap();

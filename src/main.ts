import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  await app.listen(process.env.PORT);
}
bootstrap();

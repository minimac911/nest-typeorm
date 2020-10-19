import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app/config.module';
import { DatabaseConfigModule } from './config/database/config.module';
import { PostsModule } from './models/posts/posts.module';
import { UsersModule } from './models/users/users.module';

@Module({
  imports: [DatabaseConfigModule, AppConfigModule, UsersModule, PostsModule],
})
export class AppModule {}

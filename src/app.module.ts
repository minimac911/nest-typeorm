import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { PostsModule } from './models/posts/posts.module';
import { UsersModule } from './models/users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, PostsModule],
})
export class AppModule {
  constructor(private connection: Connection) {}
}

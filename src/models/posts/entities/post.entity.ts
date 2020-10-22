import { UserEntity } from 'src/models/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IPost } from '../interface/post.interface';

@Entity({ name: 'posts' })
export class PostEntity implements IPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(
    () => UserEntity,
    user => user.posts,
  )
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  constructor(
    title: string,
    content: string,
    isPublished: boolean,
    user: UserEntity,
  ) {
    this.title = title;
    this.content = content;
    this.isPublished = isPublished;
    this.user = user;
  }
}

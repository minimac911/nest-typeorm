import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IUser } from 'src/models/users/interfaces/user.interface';
import { PostEntity } from 'src/models/posts/entities/post.entity';
import * as bcrypt from 'bcryptjs';

@Entity({ name: 'users' })
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true, default: null })
  name: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  salt: string;

  @OneToMany(
    () => PostEntity,
    post => post.user,
  )
  posts: PostEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  public async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  constructor(email: string, password: string, salt: string, name: string);
  constructor(email: string, password: string, salt: string, name?: string);
  constructor(email: string, password: string, salt: string, name?: string) {
    this.email = email;
    this.password = password;
    this.salt = salt;
    this.name = name || '';
  }
}

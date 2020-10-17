import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

@Exclude()
export class ViewPostDto {
  @Expose()
  @IsString()
  readonly id: number;

  @Expose()
  @IsString()
  readonly title: string;

  @Expose() 
  @IsString()
  readonly content: string | null;

  @Expose()
  @IsDate()
  readonly createdAt: Date;
}

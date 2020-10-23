import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ required: false, type: String })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  readonly content?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsBoolean()
  readonly isPublished?: boolean;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumberString()
  readonly userId: number;
}

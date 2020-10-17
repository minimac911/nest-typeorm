import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'This will be the name of the user',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    description:
      'Password must at least 8 characters, have at least one letter and one number.',
  })
  @Matches(RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'), {
    message:
      'Password must at least 8 characters, have at least one letter and one number.',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

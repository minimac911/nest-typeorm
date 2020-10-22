import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @ApiProperty({ required: false, type: String })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  name?: string;
}

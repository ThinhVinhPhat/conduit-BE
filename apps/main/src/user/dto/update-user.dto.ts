import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Username of the user',
    type: String,
    example: 'john_doe',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'Password of the user',
    type: String,
    example: 'abc123',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @ApiPropertyOptional({
    description: 'Bio of the user',
    type: String,
    example: 'I am a software engineer',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Avatar of the user',
    type: String,
    example: 'https://example.com/avatar.png',
  })
  @IsString()
  @IsOptional()
  avatar?: string;
}

export class RequestUpdateUserDto {
  @ApiProperty({
    description: 'User to be updated',
    type: UpdateUserDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  user: UpdateUserDto;
}

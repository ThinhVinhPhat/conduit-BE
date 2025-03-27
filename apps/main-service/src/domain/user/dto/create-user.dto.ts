import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username',
    example: 'johnDoe',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User email',
    example: 'Username@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Username',
  })
  @MinLength(8)
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User role',
    example: Role.USER,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: string;
}

export class RequestCreateUserDto {
  @ApiProperty({
    description: 'User to be created',
    type: CreateUserDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}

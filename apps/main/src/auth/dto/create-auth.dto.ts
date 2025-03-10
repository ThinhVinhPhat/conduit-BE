import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Email',
    example: 'example@gmail.com',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'password',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

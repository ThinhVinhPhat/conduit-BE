import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateCodeDTO {
  @ApiProperty({
    description: 'Validate code',
    example: '123456',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'User email',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}

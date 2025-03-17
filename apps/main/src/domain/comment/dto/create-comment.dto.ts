import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment body', example: 'This is a comment' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

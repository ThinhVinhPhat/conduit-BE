import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TagRespondWrapperDTO {
  @ApiProperty({
    description: 'Tag title',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  constructor(title: string) {
    this.title = title;
  }
}

export class TagResponsesWrapperDTO {
  @ApiProperty({
    description: 'Tag title',
    type: 'array',
  })
  @IsArray()
  @IsNotEmpty()
  title: string[];

  constructor(title: string[]) {
    this.title = title;
  }
}

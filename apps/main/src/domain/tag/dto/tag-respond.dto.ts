import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class TagDTO {
  @ApiProperty({ description: 'Tag id' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Tag title' })
  @IsNotEmpty()
  @IsString()
  title: string;
}

export class TagRespondWrapperDTO {
  @ApiProperty({
    description: 'Tag title',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  tag: TagDTO;

  constructor(props: any) {
    this.tag.id = props.id;
    this.tag.title = props.id;
  }
}

export class TagResponsesWrapperDTO {
  @ApiProperty({
    description: 'Tag title',
    type: 'array',
  })
  @IsArray()
  @IsNotEmpty()
  tags: TagDTO[];

  constructor(props: any[]) {
    this.tags = props.map((item) => {
      return {
        id: item.id,
        title: item.title,
      };
    });
  }
}

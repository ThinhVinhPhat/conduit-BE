import { ApiProperty } from '@nestjs/swagger';

export class FindByTagDTO {
  @ApiProperty({
    description: 'tags id',
    example: ['1', '2'],
    type: 'array',
  })
  tags: string[];
}

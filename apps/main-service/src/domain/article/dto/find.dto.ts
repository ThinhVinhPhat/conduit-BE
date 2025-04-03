import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindDTO {
  @ApiPropertyOptional({
    description: 'Filter by tags',
    type: 'array',
    items: { type: 'string' },
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tags: string[];

  @ApiPropertyOptional({
    description: 'Filter by followers',
    type: 'array',
    items: { type: 'string' },
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  followers: string[];

  @ApiPropertyOptional({
    description: 'Filter by author',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: 'Filter by id',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by favorite of a user(username)',
  })
  @IsOptional()
  @IsString()
  favorite?: string;

  @ApiPropertyOptional({
    description: 'The number of items to skip',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset: number;

  @ApiPropertyOptional({
    description: 'The number of items to return',
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number;
}

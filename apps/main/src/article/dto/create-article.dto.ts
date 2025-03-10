import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateArticle {
  @ApiProperty({
    description: 'Article title',
    example: 'Article title',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Article shortDescription',
    example: 'Article shortDescription',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @ApiProperty({
    description: 'Article description',
    example: 'Article description',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Article Tags',
    example: ['tags 1', 'tags 2'],
    nullable: false,
    type: 'array',
  })
  @IsOptional()
  @IsArray()
  tags: string[];
}

export class CreateArticleDTO {
  @ApiProperty({
    description: 'Create Article DTO ',
  })
  @Type(() => CreateArticle)
  @ValidateNested()
  @IsNotEmpty()
  article: CreateArticle;
}

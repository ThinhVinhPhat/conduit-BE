import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateArticle {
  @ApiProperty({
    description: 'Article title',
    example: 'Article title',
    nullable: false,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Article shortDescription',
    example: 'Article shortDescription',
    nullable: false,
  })
  @IsOptional()
  @IsString()
  shortDescription: string;

  @ApiProperty({
    description: 'Article description',
    example: 'Article description',
    nullable: false,
  })
  @IsOptional()
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

export class UpdateArticleDTO {
  @ApiProperty({
    description: 'Create Article DTO ',
  })
  @Type(() => UpdateArticle)
  @ValidateNested()
  @IsNotEmpty()
  article: UpdateArticle;
}

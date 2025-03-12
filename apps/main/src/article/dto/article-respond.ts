import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthorDto {
  @ApiProperty({
    description: 'Username of the author',
    type: String,
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Bio of the author',
    type: String,
    example: 'I am a software engineer',
  })
  bio: string;

  @ApiProperty({
    description: 'Profile image of the author',
    type: String,
    example: 'https://example.com/profile.jpg',
  })
  @Expose()
  image: string;
}

export class ArticleDto {
  @ApiProperty({
    description: 'Slug of the article',
    type: String,
    example: 'how-to-code-in-nestjs',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Slug of the article',
    type: String,
    example: 'how-to-code-in-nestjs',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Title of the article',
    type: String,
    example: 'How to Code in NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Short description of the article',
    type: String,
    example: 'An introduction to NestJS with practical examples.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Body content of the article',
    type: String,
    example:
      'In this article, we will explore how to build applications with NestJS...',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'List of tags associated with the article',
    type: [String],
    example: ['nestjs', 'backend', 'typescript'],
  })
  @IsArray()
  @IsNotEmpty()
  tagList: string[];

  @ApiProperty({
    description: 'Creation date of the article',
    type: Date,
    example: '2024-03-10T10:00:00Z',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the article',
    type: Date,
    example: '2024-03-12T12:00:00Z',
  })
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  updatedAt: Date;

  @ApiProperty({
    description: 'Number of times the article has been favorited',
    type: Number,
    example: 42,
  })
  favoritesCount: number;

  @ApiProperty({
    description: 'Author information',
    type: () => AuthorDto,
  })
  author: AuthorDto;
}

export class ArticleResponseWrapperDto {
  @ApiProperty({
    description: 'User response',
    type: ArticleDto,
  })
  article: ArticleDto;

  constructor(props: any) {
    this.article = {
      id: props.id,
      slug: props.slug,
      title: props.title,
      description: props.shortDescription,
      body: props.description,
      tagList: props.tagList,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      favoritesCount: props.totalLike,
      author: {
        username: props.user.name,
        bio: props.user.description,
        image: props.user.avatar,
      },
    };
  }
}
export class ArticleResponsesWrapperDto {
  @ApiProperty({
    description: 'User response',
    type: ArticleDto,
  })
  @Type(() => ArticleDto)
  articles: ArticleDto[];

  constructor(props: any[]) {
    this.articles = props.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      description: article.shortDescription,
      body: article.description,
      tagList: article.tagList,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      favoritesCount: article.totalLike,
      author: {
        username: article.user.name,
        bio: article.user.description,
        image: article.user.avatar,
      },
    }));
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class AuthorDto {
  @ApiProperty({
    description: 'id of the author',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

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

  @ApiProperty({
    description: 'following check of the author',
    type: String,
    example: 'https://example.com/profile.jpg',
  })
  @Expose()
  following: boolean;
}

export class ArticleDto {
  @ApiProperty({
    description: 'id of the article',
    type: String,
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
  @IsNumber()
  @IsPositive()
  @IsOptional()
  favoritesCount: number;

  @ApiProperty({
    description: 'favorite check of the article',
    type: Number,
    example: 42,
  })
  @IsBoolean()
  @IsOptional()
  favorited: boolean;

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
      favorited: props.favorited,
      author: {
        id: props.user.id,
        username: props.user.name,
        bio: props.user.description,
        image: props.user.avatar,
        following: props.user.following,
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

  @ApiProperty({
    description: 'Total number of articles',
    type: Number,
  })
  @Type(() => Number)
  articleCount: number;

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
      favorited: article.favorited,
      author: {
        id: article.user.id,
        username: article.user.name,
        bio: article.user.description,
        image: article.user.avatar,
        following: article.user.following,
      },
    }));
    this.articleCount = props.length;
  }
}

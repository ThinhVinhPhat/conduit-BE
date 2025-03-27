import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

export class CommentDto {
  @ApiProperty({
    description: 'Id of the comment',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Comment body',
    type: String,
    example: 'Nice article!',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

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
    description: 'Author information',
    type: () => AuthorDto,
  })
  author: AuthorDto;
}

export class CommentResponseWrapperDto {
  @ApiProperty({
    description: 'User response',
    type: CommentDto,
  })
  @Type(() => CommentDto)
  comment: CommentDto;

  constructor(props: any) {
    this.comment = {
      id: props.id,
      body: props.content,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      author: {
        username: props.user.name,
        bio: props.user.description,
        image: props.user.avatar,
      },
    };
  }
}
export class CommentResponsesWrapperDto {
  @ApiProperty({
    description: 'User response',
    type: CommentDto,
  })
  @Type(() => CommentDto)
  comments: CommentDto[];

  constructor(props: any[]) {
    this.comments = props.map((article) => ({
      id: article.id,
      body: article.content,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      author: {
        username: article.user.name,
        bio: article.user.description,
        image: article.user.avatar,
      },
    }));
  }
}

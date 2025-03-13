import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiOperationDecorator, Public, UserReq } from '@lib/decorators';
import { User } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
  private readonly logger: Logger;
  constructor(private readonly commentService: CommentService) {
    this.logger = new Logger('CommentController');
  }

  @ApiBearerAuth()
  @Post(':id')
  @ApiOperationDecorator({
    summary: 'Create a new comment',
    description: 'Create a new comment',
    type: CreateCommentDto,
  })
  create(
    @UserReq() user: User,
    @Body() createCommentDto: CreateCommentDto,
    @Param('id') articleId: string,
  ) {
    if (Object.keys(createCommentDto).length === 0) {
      throw new UnprocessableEntityException('Comment content is required');
    }
    try {
      const userId = user.id;
      return this.commentService.create(userId, articleId, createCommentDto);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to create comment', 400);
    }
  }

  @Public()
  @Get(':id')
  @ApiOperationDecorator({
    summary: 'Get all comments',
    description: 'Get all comments',
  })
  findAllByArticle(@Param('id') articleId: string) {
    try {
      return this.commentService.findByArticle(articleId);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to get comments', 400);
    }
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DatabaseService } from '@lib/database/database.service';
import {
  articleRespond,
  commentRespond,
  userRespond,
} from '../../constant/message';
import {
  CommentResponseWrapperDto,
  CommentResponsesWrapperDto,
} from './dto/comment-respond.dto';

@Injectable()
export class CommentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    userId: string,
    articleId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const user = await this.databaseService.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException(userRespond.get.error, HttpStatus.NOT_FOUND);
    }
    const article = await this.databaseService.article.findFirst({
      where: { id: articleId },
    });
    if (!article) {
      throw new HttpException(articleRespond.get.error, HttpStatus.NOT_FOUND);
    }
    const comment = await this.databaseService.comment.create({
      data: {
        content: createCommentDto.content,
        article: {
          connect: {
            id: article.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        user: true,
      },
    });
    return {
      status: HttpStatus.CREATED,
      data: new CommentResponseWrapperDto(comment),
      message: commentRespond.create.success,
    };
  }

  async findByArticle(articleId: string) {
    const comments = await this.databaseService.comment.findMany({
      where: { articleId },
      include: {
        user: true,
      },
    });
    return {
      status: HttpStatus.OK,
      data: new CommentResponsesWrapperDto(comments),
      message: commentRespond.get.success,
    };
  }

  async remove(id: string) {
    const comment = await this.databaseService.comment.findFirst({
      where: { id },
    });
    if (!comment) {
      throw new HttpException(commentRespond.get.error, HttpStatus.NOT_FOUND);
    }
    await this.databaseService.comment.delete({ where: { id } });
    return {
      status: HttpStatus.OK,
      message: commentRespond.delete.success,
    };
  }
}

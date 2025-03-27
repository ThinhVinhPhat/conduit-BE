import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UnprocessableEntityException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDTO } from './dto/create-article.dto';
import { UpdateArticleDTO } from './dto/update-article.dto';
import { UserReq } from '@lib/decorators/user.decorator';
import { User } from '@prisma/client';
import { ApiOperationDecorator, Public } from '@lib/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FindDTO } from './dto/find.dto';

@Controller('articles')
export class ArticleController {
  private readonly logger: Logger;
  constructor(private readonly articleService: ArticleService) {
    this.logger = new Logger(ArticleController.name);
  }

  @ApiOperationDecorator({
    description: 'Create a new article',
    summary: 'Create a new article',
    type: CreateArticleDTO,
  })
  @ApiBearerAuth()
  @Post()
  create(@UserReq() user: User, @Body() createArticleDto: CreateArticleDTO) {
    if (Object.keys(createArticleDto).length == 0) {
      throw new UnprocessableEntityException(
        " Can't create article with empty data",
      );
    }
    try {
      const userId = user.id;
      return this.articleService.create(userId, createArticleDto);
    } catch (error) {
      this.logger.error('Failed to create article', error);
    }
  }

  @ApiOperationDecorator({
    description: 'Get all articles',
    summary: 'Get all articles',
  })
  @Public()
  @Get()
  findAll(@Query() FindDTO: FindDTO) {
    try {
      return this.articleService.findAll(FindDTO);
    } catch (error) {
      this.logger.error('Failed to get all articles', error);
    }
  }
  @ApiOperationDecorator({
    description: 'Get article by favorite',
    summary: 'Get article by favorite',
  })
  @ApiBearerAuth()
  @Get('/favorite')
  async getFavoriteArticle(@UserReq() currentUser: User) {
    try {
      const userId = currentUser.id;
      return this.articleService.getFavoriteArticle(userId);
    } catch (error) {
      this.logger.error('Failed to get favorite article', error);
      throw new HttpException(
        'Failed to get favorite article',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiOperationDecorator({
    description: 'Find one article',
    summary: 'Find one article',
  })
  @Public()
  @Get(':slug')
  findOne(@Param('slug') id: string, @Query('userId') userId: string) {
    try {
      return this.articleService.findOneBySlug(id, userId);
    } catch (error) {
      this.logger.error('Failed to get article', error);
    }
  }

  @ApiOperationDecorator({
    description: 'Update one article',
    summary: 'Update one article',
    type: UpdateArticleDTO,
  })
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @UserReq() currentUser: User,
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDTO,
  ) {
    if (Object.keys(updateArticleDto).length == 0) {
      throw new UnprocessableEntityException(
        " Can't create article with empty data",
      );
    }
    try {
      const userId = currentUser.id;
      return this.articleService.update(userId, id, updateArticleDto);
    } catch (error) {
      this.logger.error('Failed to create article', error);
    }
  }

  @ApiOperationDecorator({
    description: 'Update article likes',
    summary: 'Update article likes',
  })
  @ApiBearerAuth()
  @Patch(':id/update-like')
  updateLikes(@UserReq() currentUser: User, @Param('id') id: string) {
    try {
      const userId = currentUser.id;
      return this.articleService.updateLike(userId, id);
    } catch (error) {
      this.logger.error('Failed to update like article', error);
    }
  }

  @ApiOperationDecorator({
    description: 'Delete one article',
    summary: 'Delete one article',
  })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@UserReq() currentUser: User, @Param('id') id: string) {
    const userId = currentUser.id;

    return this.articleService.remove(userId, id);
  }
}

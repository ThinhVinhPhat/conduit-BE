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
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDTO } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UserReq } from '@lib/decorators/user.decorator';
import { User } from '@prisma/client';
import { ApiOperationDecorator, Public } from '@lib/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';

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
    description: 'Get all articles Tags',
    summary: 'Get all articles Tags',
  })
  @Public()
  @Get('/get-by-tags')
  findByTags(@Query('tags') tags: string[]) {
    return this.articleService.findByTags(tags);
  }

  @ApiOperationDecorator({
    description: 'Get all articles',
    summary: 'Get all articles',
  })
  @Public()
  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @ApiOperationDecorator({
    description: 'Get all articles by User',
    summary: 'Get all articles by User',
  })
  @ApiBearerAuth()
  @Get('/find-by-user')
  findAllByUser(@UserReq() user: User) {
    const userId = user.id;
    return this.articleService.findAllByUser(userId);
  }

  @ApiOperationDecorator({
    description: 'Find one article',
    summary: 'Find one article',
  })
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @ApiOperationDecorator({
    description: 'Update one article',
    summary: 'Update one article',
    type: UpdateArticleDto,
  })
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @UserReq() currentUser: User,
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
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
    type: UpdateArticleDto,
  })
  @ApiBearerAuth()
  @Patch(':id/update-like')
  updateLikes(@UserReq() currentUser: User, @Param('id') id: string) {
    try {
      const userId = currentUser.id;
      return this.articleService.updateLike(userId, id);
    } catch (error) {
      this.logger.error('Failed to create article', error);
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

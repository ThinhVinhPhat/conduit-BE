import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateArticleDTO } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { articleRespond, userRespond } from '../constant/message';
import { DatabaseService } from '@lib/database';
import { IArticleResponse } from '@lib/types/index';
import { TagService } from '../tag/tag.service';
import slugify from 'slugify';
import { Article, Tag } from '@prisma/client';
import {
  ArticleResponsesWrapperDto,
  ArticleResponseWrapperDto,
} from './dto/article-respond';
@Injectable()
export class ArticleService {
  private readonly Logger;
  constructor(
    private readonly prisma: DatabaseService,
    private readonly tagService: TagService,
  ) {
    this.Logger = new Logger(ArticleService.name);
  }

  private getTag = async (articlesId: string) => {
    const articleTags = await this.prisma.articleTag.findMany({
      where: {
        articleId: articlesId,
      },
      include: {
        tag: true,
      },
    });

    const uniqueTags = Array.from(
      new Map(
        articleTags.map((item) => [item.tag.id, item.tag.title]),
      ).values(),
    );
    return uniqueTags;
  };

  async create(userId: string, createArticleDto: CreateArticleDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException(userRespond.get.error, HttpStatus.NOT_FOUND);
    }

    const { title, description, shortDescription, tags } =
      createArticleDto.article;
    const slug = slugify(title, { lower: true, strict: true });
    try {
      const result = await this.prisma.$transaction(async () => {
        const article = await this.prisma.article.create({
          data: {
            title: title,
            description: description,
            shortDescription: shortDescription,
            slug: slug,
            totalLike: 0,
            active: true,
            createdAt: new Date(),
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

        await this.prisma.tag.createMany({
          data: tags.map((tag) => ({
            title: tag,
          })),
          skipDuplicates: true,
        });

        const findTags = await this.prisma.tag.findMany({
          where: {
            title: {
              in: tags,
            },
          },
          select: { id: true },
        });

        await this.prisma.articleTag.createMany({
          data: findTags.map((tag) => ({
            articleId: article.id,
            tagId: tag.id,
            createdAt: new Date(),
          })),
          skipDuplicates: true,
        });
        return article;
      });
      return {
        status: HttpStatus.OK,
        data: new ArticleResponseWrapperDto({
          ...result,
          tagList: await this.getTag(result.id),
        }),
        message: articleRespond.create.success,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        articleRespond.create.error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    const articles: Article[] = await this.prisma.article.findMany({
      include: {
        user: true,
        articleTag: true,
      },
    });

    const wrappedArticle = await Promise.all(
      articles.map(async (article) => ({
        ...article,
        tagList: await this.getTag(article.id),
      })),
    );
    return {
      status: HttpStatus.OK,
      data: new ArticleResponsesWrapperDto(wrappedArticle),
      message: articleRespond.get.success,
    };
  }

  async findAllByUser(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException(userRespond.get.error, HttpStatus.NOT_FOUND);
    }
    const articles = await this.prisma.article.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        articleTag: true,
      },
    });
    const wrappedArticle = await Promise.all(
      articles.map(async (article) => ({
        ...article,
        tagList: await this.getTag(article.id),
      })),
    );
    return {
      status: HttpStatus.OK,
      data: new ArticleResponsesWrapperDto(wrappedArticle),
      message: articleRespond.get.success,
    };
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        articleTag: true,
      },
    });
    if (!article) {
      throw new HttpException(articleRespond.get.error, HttpStatus.NOT_FOUND);
    }

    const result = await this.getTag(article.id);
    return {
      status: HttpStatus.OK,
      data: new ArticleResponseWrapperDto({ ...article, tagList: result }),
      message: articleRespond.get.success,
    };
  }

  async findByTags(tags: string | string[]) {
    const articleTags = await this.prisma.articleTag.findMany({
      where: {
        tagId: {
          in: Array.isArray(tags) ? tags : [tags],
        },
      },
      include: {
        article: true,
      },
    });

    const articles = await this.prisma.article.findMany({
      where: {
        id: {
          in: articleTags.map((articleTag) => articleTag.articleId),
        },
      },
      include: {
        user: true,
        articleTag: true,
      },
    });

    const wrappedArticle = await Promise.all(
      articles.map(async (article) => ({
        ...article,
        tagList: await this.getTag(article.id),
      })),
    );
    return {
      status: HttpStatus.OK,
      data: new ArticleResponsesWrapperDto(wrappedArticle),
      message: articleRespond.get.success,
    };
  }

  async updateLike(userId: string, id: string) {
    const article = await this.prisma.article.findFirst({
      where: { id },
      include: {
        user: true,
        articleTag: true,
      },
    });
    if (!article) {
      throw new HttpException(articleRespond.get.error, HttpStatus.NOT_FOUND);
    }
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException(userRespond.get.error, HttpStatus.NOT_FOUND);
    }
    const articleFavorite = await this.prisma.favorite.findFirst({
      where: { userId: user.id, articleId: article.id },
    });
    if (articleFavorite) {
      await this.prisma.favorite.delete({ where: { id: articleFavorite.id } });
      await this.prisma.article.update({
        where: { id: article.id },
        data: {
          totalLike: article.totalLike - 1,
        },
      });
    }
    await this.prisma.favorite.create({
      data: {
        userId: user.id,
        articleId: article.id,
      },
    });
    await this.prisma.article.update({
      where: { id: article.id },
      data: {
        totalLike: article.totalLike + 1,
      },
    });
    return {
      status: HttpStatus.OK,
      data: new ArticleResponseWrapperDto(article),
      message: articleRespond.get.success,
    };
  }

  async update(userId: string, id: string, updateArticleDto: UpdateArticleDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException(userRespond.get.error, HttpStatus.NOT_FOUND);
    }

    const article = await this.prisma.article.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });
    if (!article) {
      throw new HttpException(articleRespond.get.error, HttpStatus.NOT_FOUND);
    }
    if (article.active == false) {
      throw new HttpException(
        articleRespond.get.unActive,
        HttpStatus.FORBIDDEN,
      );
    }
    const { title, tags, description, shortDescription } =
      updateArticleDto.article;
    const slug = slugify(title);

    tags.map(async (item) => {
      const tag = await this.prisma.tag.findFirst({
        where: {
          title: item,
        },
      });
      const articleTag = await this.prisma.articleTag.findFirst({
        where: {
          articleId: id,
          tagId: tag.id,
        },
      });

      const tagResult = await this.prisma.tag.upsert({
        where: {
          id: tag?.id,
        },
        update: {
          title: item,
        },
        create: {
          title: item,
        },
      });
      await this.prisma.articleTag.upsert({
        where: {
          id: articleTag.id,
        },
        update: {
          articleId: id,
          tagId: tagResult.id,
        },
        create: {
          articleId: id,
          tagId: tagResult.id,
        },
      });
    });

    const updatedArticle = await this.prisma.article.update({
      where: {
        id: id,
      },
      data: {
        title: title,
        slug: slug,
        description: description,
        shortDescription: shortDescription,
      },
      include: {
        user: true,
        articleTag: true,
      },
    });
    const result = await this.getTag(article.id);

    return {
      status: HttpStatus.OK,
      data: new ArticleResponseWrapperDto({
        ...updatedArticle,
        tagList: result,
      }),
      message: articleRespond.get.success,
    };
  }

  async remove(userId: string, id: string): Promise<IArticleResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new HttpException(userRespond.get.error, HttpStatus.NOT_FOUND);
    }
    const article = this.prisma.article.findUnique({
      where: {
        id: id,
      },
    });
    if (!article) {
      throw new HttpException(articleRespond.get.error, HttpStatus.NOT_FOUND);
    }
    await this.prisma.articleTag.deleteMany({
      where: { articleId: id },
    });

    await this.prisma.article.delete({
      where: {
        id: id,
      },
    });

    return {
      status: HttpStatus.OK,
      message: articleRespond.delete.success,
    };
  }
}

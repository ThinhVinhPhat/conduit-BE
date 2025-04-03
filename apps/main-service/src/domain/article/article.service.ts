import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateArticleDTO } from './dto/create-article.dto';
import { UpdateArticleDTO } from './dto/update-article.dto';
import { articleRespond, userRespond } from '../../constant/message';
import { DatabaseService } from '@lib/database';
import { IArticleResponse } from '@lib/types/index';
import slugify from 'slugify';
import {
  ArticleResponsesWrapperDto,
  ArticleResponseWrapperDto,
} from './dto/article-respond';
import { FindDTO } from './dto/find.dto';
@Injectable()
export class ArticleService {
  private readonly logger: Logger;
  constructor(private readonly prisma: DatabaseService) {
    this.logger = new Logger(ArticleService.name);
  }

  private generateSlug = (title: string) => {
    return slugify(title + '-' + Date.now(), { lower: true, strict: true });
  };
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

  private isFavorited = async (userId: string, articleId: string) => {
    const favorited = await this.prisma.favorite.findFirst({
      where: {
        userId: userId,
        articleId: articleId,
      },
    });

    return favorited ? true : false;
  };

  private isFollowing = async (userId: string, authorId: string) => {
    const following = await this.prisma.following.findFirst({
      where: {
        userId: userId,
        followerId: authorId,
      },
    });
    return following ? true : false;
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
    const slug = this.generateSlug(title);

    try {
      const result = await this.prisma.$transaction(async () => {
        try {
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
        } catch (error) {
          console.error(error);
        }
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
      this.logger.warn('Failed create User', error);
      throw new HttpException(
        articleRespond.create.error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(FindDTO: FindDTO) {
    const { userId, limit, offset, author, favorite, tags, followers } =
      FindDTO;

    const filters = [];

    if (author) {
      filters.push({ user: { name: author } });
    }
    if (tags) {
      filters.push({ articleTag: { some: { tag: { title: { in: tags } } } } });
    }
    if (favorite) {
      filters.push({ favorites: { some: { user: { name: favorite } } } });
    }
    if (followers) {
      filters.push({ user: { name: { in: followers } } });
    }

    const whereClause = filters.length > 0 ? { OR: filters } : {};

    const query = await this.prisma.article.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      include: {
        user: true,
        articleTag: true,
      },
    });

    if (userId && userId !== '0') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }

    const wrappedArticle = await Promise.all(
      query.map(async (article) => ({
        ...article,
        favorited: await this.isFavorited(userId, article.id),
        tagList: await this.getTag(article.id),
        user: {
          ...article.user,
          following: userId
            ? await this.isFollowing(userId, article.user.id)
            : false,
        },
      })),
    );
    return {
      status: HttpStatus.OK,
      data: new ArticleResponsesWrapperDto(wrappedArticle),
      message: articleRespond.get.success,
    };
  }

  async getFavoriteArticle(userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new HttpException(articleRespond.get.error, HttpStatus.NOT_FOUND);
    }
    const favoriteArticle = await this.prisma.article.findMany({
      where: {
        favorites: {
          some: {
            userId,
          },
        },
      },
      include: {
        user: true,
      },
    });

    const wrappedArticle = await Promise.all(
      favoriteArticle.map(async (article) => ({
        ...article,
        tagList: await this.getTag(article.id),
        user: article.user,
      })),
    );

    return {
      status: HttpStatus.OK,
      data: new ArticleResponsesWrapperDto(wrappedArticle),
      message: articleRespond.get.success,
    };
  }

  async findOneBySlug(slug: string, userId?: string) {
    const article = await this.prisma.article.findFirst({
      where: {
        slug: slug,
      },
      include: {
        user: true,
        articleTag: true,
      },
    });
    if (!article) {
      throw new HttpException(articleRespond.get.error, HttpStatus.NOT_FOUND);
    }

    if (userId && userId !== '0') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }

    const wrappedArticle = {
      ...article,
      favorited: await this.isFavorited(userId, article.id),
      tagList: await this.getTag(article.id),
      user: {
        ...article.user,
        following: userId
          ? await this.isFollowing(userId, article.user.id)
          : false,
      },
    };
    return {
      status: HttpStatus.OK,
      data: new ArticleResponseWrapperDto(wrappedArticle),
      message: articleRespond.get.success,
    };
  }

  async updateLike(userId: string, id: string) {
    const article = await this.prisma.article.findFirst({
      where: { id: id },
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
      return {
        status: HttpStatus.OK,
        message: articleRespond.updateLike.remove,
      };
    }
    await this.prisma.favorite.create({
      data: {
        userId: user.id,
        articleId: article.id,
      },
      include: {
        user: true,
        article: true,
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
      message: articleRespond.updateLike.add,
    };
  }

  async update(userId: string, id: string, updateArticleDto: UpdateArticleDTO) {
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
      where: {
        articleId: id,
      },
    });

    await this.prisma.article.deleteMany({
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

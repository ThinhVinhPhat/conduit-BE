import { DatabaseService } from '@lib/database';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('Article Controller', () => {
  let articleController: ArticleController;
  let articleService: ArticleService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        ArticleService,
        {
          provide: DatabaseService,
          useValue: {},
        },
      ],
    }).compile();
    articleController = module.get<ArticleController>(ArticleController);
    articleService = module.get<ArticleService>(ArticleService);
  });

  it('controler should be defined', () => {
    expect(articleController).toBeDefined();
  });

  describe(' GET /articles', () => {
    it('should return all articles', async () => {
      const mockArticle = {
        status: 200,
        data: {
          article: {
            id: '1',
            title: 'Article 1',
            slug: 'article-1',
            description: 'Description 1',
            body: 'Body 1',
            tagList: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            favoritesCount: 0,
            favorited: false,
            author: {
              id: '1',
              username: 'author1',
              bio: 'Bio 1',
              image: 'Image 1',
              following: false,
            },
          },
        },
        message: 'Find Success',
      };
      jest
        .spyOn(articleService, 'findOneBySlug')
        .mockResolvedValue(mockArticle);
      const response = await articleController.findOne('article-1', 'userId');
      expect(response).toEqual(mockArticle);
    });
  });
});

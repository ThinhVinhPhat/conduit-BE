import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { DatabaseModule } from '@lib/database';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [DatabaseModule, TagModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}

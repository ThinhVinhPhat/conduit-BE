import { PartialType } from '@nestjs/swagger';
import { CreateArticleDTO } from './create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDTO) {}

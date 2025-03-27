import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ArticleModule } from '../article/article.module';
import { AuthModule } from '../auth/auth.module';
import { ConduitPostmarkModule } from '@lib/conduit-postmark';
import { config } from '../../config';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ArticleModule,
    ConduitPostmarkModule.register({ apiToken: config.postmark.API_KEY }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

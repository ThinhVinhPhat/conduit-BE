import { Module } from '@nestjs/common';
import { DatabaseModule } from '@lib/database';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config, validate } from './config';
import { UserModule } from './domain/user/user.module';
import { ArticleModule } from './domain/article/article.module';
import { TagModule } from './domain/tag/tag.module';
import { CommentModule } from './domain/comment/comment.module';
import { FollowingModule } from './domain/following/following.module';
import { AuthModule } from './domain/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './domain/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConduitPostmarkModule } from '@lib/conduit-postmark/conduit-postmark.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConduitImagekitModule } from '@lib/conduit-imagekit';
import { FileModule } from './domain/file/file.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      validate,
    }),
    JwtModule.register({
      global: true,
      secret: config.jwt.SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule.forRoot({
      dbUsername: config.DB_USERNAME,
      dbPassword: config.DB_PASSWORD,
      dbHost: config.DB_HOST,
      dbPort: config.DB_PORT,
      dbName: config.DB_NAME,
    }),
    ConduitPostmarkModule.forRoot({
      apiToken: config.postmark.API_KEY,
    }),
    ConduitImagekitModule.forRoot({
      publicKey: config.imageKit.PUBLIC_KEY,
      privateKey: config.imageKit.PRIVATE_KEY,
      url: config.imageKit.URL,
    }),
    UserModule,
    ArticleModule,
    TagModule,
    CommentModule,
    FollowingModule,
    AuthModule,
    FileModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class MainModule {}

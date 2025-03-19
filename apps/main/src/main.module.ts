import { Module } from '@nestjs/common';
import { DatabaseModule } from '@lib/database';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config, validate } from './config';
import { UserModule } from './domain/user/user.module';
import { ArticleModule } from './domain/article/article.module';
import { TagModule } from './domain/tag/tag.module';
import { CommentModule } from './domain/comment/comment.module';
import { FollowingModule } from './domain/following/following.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      validate,
    }),
    JwtModule.register({
      global: true,
      secret: new ConfigService().get('JWT_SECRET'),
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
    UserModule,
    ArticleModule,
    TagModule,
    CommentModule,
    FollowingModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class MainModule {}

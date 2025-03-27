import { Module } from '@nestjs/common';
import { FollowingService } from './following.service';
import { FollowingController } from './following.controller';
import { DatabaseModule } from '@lib/database';

@Module({
  imports: [DatabaseModule],
  controllers: [FollowingController],
  providers: [FollowingService],
})
export class FollowingModule {}

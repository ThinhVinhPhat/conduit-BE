import {
  Controller,
  Post,
  Param,
  Delete,
  Get,
  Logger,
  HttpException,
} from '@nestjs/common';
import { FollowingService } from './following.service';
import { ApiOperationDecorator, UserReq } from '@lib/decorators';
import { User } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('following')
export class FollowingController {
  private readonly logger: Logger;
  constructor(private readonly followingService: FollowingService) {
    this.logger = new Logger('FollowingController');
  }

  @ApiOperationDecorator({
    summary: 'Create a new following',
    description: 'Create a new following between two users',
  })
  @ApiBearerAuth()
  @Post('/:id')
  create(@Param('id') followingId: string, @UserReq() currentUser: User) {
    try {
      const userId = currentUser.id;
      return this.followingService.create(followingId, userId);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to create following', 500);
    }
  }

  @ApiOperationDecorator({
    summary: 'Get user Followers',
    description: 'Get user Followers',
  })
  @ApiBearerAuth()
  @Get('/get-followers')
  getFollowers( @UserReq() currentUser: User) {
    try {
      const userId = currentUser.id;
      return this.followingService.getFollowers( userId);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to create following', 500);
    }
  }



  @ApiOperationDecorator({
    summary: 'Delete a following',
    description: 'Delete a following between two users',
  })
  @ApiBearerAuth()
  @Delete('/:id')
  remove(@Param('id') followingId: string, @UserReq() currentUser: User) {
    try {
      const userId = currentUser.id;
      return this.followingService.remove(followingId, userId);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Failed to remove following', 500);
    }
  }
}

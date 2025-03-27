import { DatabaseService } from '@lib/database';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { userRespond } from '../../constant/message';

@Injectable()
export class FollowingService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(followingId: string, userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
      throw new HttpException(userRespond.get.error, HttpStatus.BAD_REQUEST);
    }
    const followingUser = await this.prisma.user.findFirst({
      where: { id: followingId },
    });
    if (!followingUser) {
      throw new HttpException(
        'Cannot find the following user',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (followingUser.id === user.id) {
      throw new HttpException(
        "You can't follow yourself",
        HttpStatus.BAD_REQUEST,
      );
    }

    const following = await this.prisma.following.findFirst({
      where: {
        userId: userId,
        followerId: followingId,
      },
    });
    if (following) {
      throw new HttpException(
        'You are already following this user',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newFollowing = await this.prisma.following.create({
      data: {
        userId: userId,
        followerId: followingId,
      },
      include: {
        user: true,
      },
    });
    return {
      status: 200,
      following: newFollowing,
      message: 'You are now following this user',
    };
  }

  async remove(followingId: string, userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new HttpException(userRespond.get.error, HttpStatus.BAD_REQUEST);
    }
    const followingUser = await this.prisma.user.findFirst({
      where: { id: followingId },
    });
    if (!followingUser) {
      throw new HttpException(
        'Cannot find the following user',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (followingUser.id === user.id) {
      throw new HttpException(
        "You can't unfollow yourself",
        HttpStatus.BAD_REQUEST,
      );
    }
    const following = await this.prisma.following.findFirst({
      where: {
        userId: userId,
        followerId: followingId,
      },
    });
    if (!following) {
      throw new HttpException(
        'You are not following this user',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.following.delete({
      where: {
        id: following.id,
      },
    });
    return {
      status: 200,
      message: 'You are no longer following this user',
    };
  }
}

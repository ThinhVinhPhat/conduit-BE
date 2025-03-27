import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '@lib/database';
import {
  TagRespondWrapperDTO,
  TagResponsesWrapperDTO,
} from './dto/tag-respond.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: DatabaseService) {}

  async findAll() {
    const tags = await this.prisma.tag.findMany({
      where: {
        articleTag: {
          some: {},
        },
      },
      include: {
        articleTag: true,
      },
    });

    return {
      status: HttpStatus.OK,
      data: new TagResponsesWrapperDTO(tags),
      message: 'Find Tag successfully',
    };
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    if (!tag) {
      throw new HttpException('Tag not found', HttpStatus.BAD_REQUEST);
    }
    return {
      status: HttpStatus.OK,
      data: new TagRespondWrapperDTO(tag.title),
      message: 'Find Tag successfully',
    };
  }

  async remove(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id: id },
    });
    if (!tag) {
      throw new HttpException('Tag not found', HttpStatus.BAD_REQUEST);
    }
    await this.prisma.tag.delete({
      where: {
        id: id,
      },
    });
  }
  async removeAll() {
    await this.prisma.tag.deleteMany();
    return {
      status: HttpStatus.OK,
      message: 'Remove all tags successfully',
    };
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '@lib/database';

@Injectable()
export class TagService {
  constructor(private readonly prisma: DatabaseService) {}
  // create(createTagDto: CreateTagDto) {
  //   return 'This action adds a new tag';
  // }

  async findAll() {
    return await this.prisma.tag.findMany();
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    if (!tag) {
      throw new HttpException('Tag not found', HttpStatus.BAD_REQUEST);
    }
    return {
      status: HttpStatus.OK,
      data: {
        id: tag.id,
        title: tag.title,
        active: tag.active,
        createdAt: tag.createdAt,
      },
      message: 'Find Tag successfully',
    };
  }

  async remove(id: number) {
    await this.prisma.tag.deleteMany({});
    return `This action removes a #${id} tag`;
  }
}

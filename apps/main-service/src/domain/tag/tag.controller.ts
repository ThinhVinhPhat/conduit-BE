import {
  Controller,
  Get,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiOperationDecorator, Public, Roles } from '@lib/decorators';
import { Role } from '../../constant/role';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @ApiOperationDecorator({
    summary: 'Get all tags',
    description: 'Get all tags',
  })
  @Get()
  findAll() {
    try {
      return this.tagService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Public()
  @ApiOperationDecorator({
    summary: 'Get tag with id',
    description: 'Get tag with id',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.tagService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
  //   return this.tagService.update(+id, updateTagDto);
  // }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperationDecorator({
    summary: 'Delete tag with id',
    description: 'Delete tag with id',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperationDecorator({
    summary: 'Delete all tags',
    description: 'Delete all tags',
  })
  @Delete(':id')
  removeAll() {
    return this.tagService.removeAll();
  }
}

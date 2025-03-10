import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '@lib/decorators';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
  //   return this.tagService.update(+id, updateTagDto);
  // }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiOperationCustom } from 'src/custom-decorator';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperationCustom('Tag', 'POST')
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Patch(':id')
  @ApiOperationCustom('Tag', 'PATCH')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperationCustom('Tag', 'DELETE')
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}

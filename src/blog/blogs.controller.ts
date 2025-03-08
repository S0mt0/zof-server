import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { StringPipe } from 'src/lib/pipes';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':blogId')
  findByBlogId(@Param('blogId', StringPipe) blogId: string) {
    return this.blogsService.findByBlogId(blogId);
  }

  @Delete(':blogId')
  delete(@Param('blogId', StringPipe) blogId: string) {
    return this.blogsService.delete(blogId);
  }

  @Patch(':blogId')
  update(
    @Param('blogId', StringPipe) blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(blogId, updateBlogDto);
  }
}

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
import { Message } from 'src/lib/decorators';

@Message()
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get(':blogId')
  findByBlogId(@Param('blogId') blogId: string) {
    return this.blogsService.findByBlogId(blogId);
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Message('Blog updated')
  @Patch(':blogId')
  update(
    @Param('blogId') blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(blogId, updateBlogDto);
  }

  @Message('Blog deleted')
  @Delete(':blogId')
  delete(@Param('blogId') blogId: string) {
    return this.blogsService.delete(blogId);
  }
}

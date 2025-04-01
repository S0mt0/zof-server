import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Message, Protect, Public } from 'src/lib/decorators';
import { ParseBlogQueryDto } from './dto';

@Protect()
@Message()
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto, @Req() req: Request) {
    return this.blogsService.create(createBlogDto, req.user['_id']);
  }

  @Public()
  @Get()
  findAll(@Query() query: ParseBlogQueryDto) {
    return this.blogsService.findAll(query);
  }

  @Public()
  @Get(':blogId')
  findByBlogId(@Param('blogId') blogId: string) {
    return this.blogsService.findByBlogId(blogId);
  }

  @Message('Blog updated')
  @Patch(':blogId')
  update(
    @Param('blogId') blogId: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(blogId, updateBlogDto);
  }

  @Post('upload-banner')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

  @Delete(':blogId')
  delete(@Param('blogId') blogId: string) {
    return this.blogsService.delete(blogId);
  }
}

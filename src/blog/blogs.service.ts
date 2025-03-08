import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';

import { Blog } from './schema/blog.schema';
import { CreateBlogDto, UpdateBlogDto } from './dto';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  create(dto: CreateBlogDto) {
    return this.blogModel.create(dto);
  }

  async findByBlogId(blogId: string): Promise<Blog | undefined> {
    const blog = await this.blogModel.findOne({ blogId });

    if (!blog) throw new NotFoundException('Blog post not found.');

    return blog;
  }

  findAll(filter?: RootFilterQuery<Blog>, query?: Record<string, any>) {
    console.log({ query });
    return this.blogModel.find(filter);
  }

  async update(blogId: string, dto: UpdateBlogDto) {
    const blog = await this.blogModel.findOneAndUpdate({ blogId }, dto, {
      runValidators: true,
      new: true,
    });

    if (!blog) throw new NotFoundException('Blog post not found.');

    return blog;
  }

  delete(blogId: string): Promise<string> {
    return this.blogModel.findOneAndDelete({ blogId });
  }
}

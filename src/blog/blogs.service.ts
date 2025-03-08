import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';

import { Blog } from './schema/blog.schema';
import { CreateBlogDto, UpdateBlogDto } from './dto';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async findOne(filter: RootFilterQuery<Blog>): Promise<Blog | undefined> {
    return this.blogModel.findOne(filter);
  }

  async findByBlogId(blogId: string): Promise<Blog | undefined> {
    const blog = this.blogModel.findOne({ blogId });

    if (!blog) throw new NotFoundException();

    return blog;
  }

  async delete(blogId: string): Promise<Blog | undefined> {
    return this.blogModel.findOneAndDelete({ blogId });
  }

  create(dto: CreateBlogDto) {
    return this.blogModel.create(dto);
  }

  update(blogId: string, dto: UpdateBlogDto) {
    return this.blogModel.findOneAndUpdate({ blogId }, dto, {
      runValidators: true,
      new: true,
    });
  }

  findAll(filter?: RootFilterQuery<Blog>) {
    return this.blogModel.find(filter);
  }
}

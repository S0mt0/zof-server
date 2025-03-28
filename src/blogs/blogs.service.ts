import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Blog, syncBlogIdWithTitle } from './schema/blog.schema';
import { CreateBlogDto, ParseBlogQueryDto, UpdateBlogDto } from './dto';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async create(dto: CreateBlogDto, userId: string) {
    const blog = await this.blogModel.create(dto);
    blog.publishedBy = userId as any;

    return blog;
  }

  async findByBlogId(blogId: string): Promise<Blog | undefined> {
    const blog = await this.blogModel.findOne({ blogId });

    if (!blog) throw new NotFoundException('Blog post not found.');

    return blog;
  }

  async findAll(query: ParseBlogQueryDto) {
    const { sort, fields, draft, featured, page, limit } = query;

    const filter: Record<string, any> = {};

    if (draft !== undefined) {
      filter.draft = draft;
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    const fieldsList = fields ? fields.split(',').join(' ') : '';

    const skip = (page - 1) * limit;

    const blogs = await this.blogModel
      .find(filter)
      .sort(sort)
      .select(fieldsList)
      .skip(skip)
      .limit(limit > 10 ? 10 : limit);

    const totalCount = await this.blogModel.countDocuments(filter);

    return {
      blogs,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async update(blogId: string, dto: UpdateBlogDto) {
    if (dto.title) {
      dto = {
        ...dto,
        blogId: syncBlogIdWithTitle(dto.title),
      } as UpdateBlogDto;
    }

    const blog = await this.blogModel.findOneAndUpdate({ blogId }, dto, {
      runValidators: true,
      new: true,
    });

    if (!blog) throw new NotFoundException('Blog post not found.');

    return blog;
  }

  async delete(blogId: string) {
    await this.blogModel.findOneAndDelete({ blogId });

    return 'Blog deleted';
  }
}

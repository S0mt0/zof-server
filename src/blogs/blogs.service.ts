import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as stream from 'stream';

import { Blog, syncBlogIdWithTitle } from './schema/blog.schema';
import { CreateBlogDto, ParseBlogQueryDto, UpdateBlogDto } from './dto';
import { cloudinary } from 'src/lib/config';
import { CLOUDINARY_UPLOAD_PRESET } from 'src/lib/constants';

@Injectable()
export class BlogsService {
  u_preset: string;

  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private configService: ConfigService,
  ) {
    this.u_preset = this.configService.get(CLOUDINARY_UPLOAD_PRESET);
  }

  async create(dto: CreateBlogDto, userId: string) {
    const blogExists = await this.blogModel.exists({
      title: new RegExp(dto.title, 'i'),
    });

    if (blogExists)
      throw new ConflictException(
        'Blog with the same title already exists. Choose a different title.',
      );

    const blog = await this.blogModel.create({ ...dto, publishedBy: userId });

    return blog;
  }

  async findByBlogId(blogId: string): Promise<Blog | undefined> {
    const blog = await this.blogModel.findOne({ blogId });

    if (!blog) throw new NotFoundException('Blog post not found.');

    return blog;
  }

  async findAll(query: ParseBlogQueryDto) {
    const { sort, fields, draft, featured, page, limit, title } = query;

    const filter: Record<string, any> = {};

    if (draft !== undefined) {
      filter.draft = draft;
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    if (title !== undefined || title.trim().length) {
      filter.title = new RegExp(title, 'i');
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

  // async uploadBanner(file: Express.Multer.File) {
  //   const public_id = `IMG_${Date.now()}`;

  //   // Convert buffer to data URI
  //   const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

  //   const uploadResponse = await cloudinary.uploader.upload(dataUri, {
  //     upload_preset: this.u_preset,
  //     resource_type: 'image',
  //     public_id,
  //   });

  //   const bannerUrl = uploadResponse.secure_url;
  //   return { bannerUrl };
  // }

  async uploadBanner(file: Express.Multer.File) {
    const allowedFileTypes = ['image/jpg', 'image/png', 'image/jpeg'];
    const maxFileSize = 2000000; // 2MB

    if (!allowedFileTypes.includes(file.mimetype))
      throw new UnprocessableEntityException('File type unsupported');

    if (file.size > maxFileSize)
      throw new UnprocessableEntityException('File size too large');
    const public_id = `IMG_${Date.now()}`;

    const uploadStream = new stream.PassThrough();
    uploadStream.end(file.buffer);

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          upload_preset: this.u_preset,
          resource_type: 'image',
          public_id,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url });
        },
      );

      uploadStream.pipe(upload);
    });
  }

  async deleteFile(url: string) {
    const parts = url?.split('/');
    let fileName = '';

    if (parts) fileName = parts[parts?.length - 1].split('.')[0];

    const old_public_id = `${this.u_preset}/${fileName}`;
    await cloudinary.uploader.destroy(old_public_id, {
      invalidate: true,
      resource_type: 'image',
    });
  }

  async delete(blogId: string) {
    await this.blogModel.findOneAndDelete({ blogId });

    return 'Blog deleted';
  }
}

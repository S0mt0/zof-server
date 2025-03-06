import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './database/schemas/blogs.schema';
import { UserModel } from 'src/users/database/interface';
import { User } from 'src/users/database/schemas/user.schema';
import { CreateBlogDto } from './dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly userService: UsersService,
  ) {}

  /**
   *  Create a blog and link it to a user
   * @param userId - The ID of the user creating the blog
   * @param createBlogDto - The blog data to be created
   * @returns The created blog document
   */
  public async createBlog(
    userId: string,
    createBlogDto: CreateBlogDto,
  ): Promise<BlogDocument> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const blog = await this.blogModel.create({
      ...createBlogDto,
      user: user._id,
    });

    user.blogs.push(blog.id);
    await user.save();

    return blog;
  }

  /**
   *  Get all blogs with user details
   * @returns A list of all blogs with user information
   */
  public async getAllBlogs(): Promise<BlogDocument[]> {
    return this.blogModel.find().populate('user', 'first_name last_name');
  }

  /**
   *  Get blogs by a specific user
   * @param userId - The ID of the user
   * @returns A list of blogs associated with the user
   */
  public async getUserBlogs(userId: string): Promise<BlogDocument[]> {
    return this.blogModel.find({ user: userId }).populate('user');
  }

  /**
   *  Get a single blog by ID
   * @param blogId - The ID of the blog to retrieve
   * @returns The blog document
   */
  public async getBlogById(blogId: string): Promise<BlogDocument> {
    const blog = await this.blogModel.findById(blogId).populate('user');
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  /**
   *  Delete a blog
   * @param blogId - The ID of the blog to delete
   * @returns A success message
   */
  public async deleteBlog(blogId: string): Promise<{ message: string }> {
    const blog = await this.blogModel.findByIdAndDelete(blogId);
    if (!blog) throw new NotFoundException('Blog not found');

    // await this.userModel.updateMany(
    //   { blogs: blogId },
    //   { $pull: { blogs: blogId } },
    // );

    return { message: 'Blog deleted successfully' };
  }
}

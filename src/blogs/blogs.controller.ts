import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  /**
   *  Create a new blog
   * @param userId - The ID of the user creating the blog
   * @param createBlogDto - The blog content
   * @returns The newly created blog
   */

  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  async createBlog(
    @Param('userId') userId: string,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return await this.blogService.createBlog(userId, createBlogDto);
  }

  /**
   *  Get all blogs
   * @returns A list of all blogs
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBlogs() {
    return await this.blogService.getAllBlogs();
  }

  /**
   *  Get a specific blog by ID
   * @param blogId - The ID of the blog to retrieve
   * @returns The blog details
   */
  @Get(':blogId')
  @UseGuards(JwtAuthGuard)
  async getBlogById(@Param('blogId') blogId: string) {
    return await this.blogService.getBlogById(blogId);
  }

  /**
   *  Get all blogs by a specific user
   * @param userId - The ID of the user
   * @returns The list of blogs belonging to the user
   */
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserBlogs(@Param('userId') userId: string) {
    return await this.blogService.getUserBlogs(userId);
  }

  /**
   *  Delete a blog
   * @param blogId - The ID of the blog to delete
   * @returns A success message
   */
  @Delete(':blogId')
  @UseGuards(JwtAuthGuard)
  async deleteBlog(@Param('blogId') blogId: string) {
    return await this.blogService.deleteBlog(blogId);
  }
}

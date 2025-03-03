import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { Post as PostModel } from './models/post.model';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  // constructor(@InjectModel(PostModel) private postModel: typeof PostModel) {}
  // async create(createPostDto: CreatePostDto) {
  //   return this.postModel.create({ ...createPostDto });
  // }
  // async findAll() {
  //   return this.postModel.findAll({ include: { all: true } });
  // }
  // async findOne(id: string) {
  //   const post = await this.postModel.findByPk(id, { include: { all: true } });
  //   if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
  //   return post;
  // }
  // async update(id: string, updatePostDto: UpdatePostDto) {
  //   const post = await this.findOne(id);
  //   return post.update({ ...updatePostDto });
  // }
  // async delete(id: string) {
  //   const post = await this.findOne(id);
  //   await post.destroy();
  //   return { message: 'Post deleted successfully' };
  // }
}

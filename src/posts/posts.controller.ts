import { Controller } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  // constructor(private readonly postService: PostService) {}
  // @Post()
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // create(@Body() createPostDto: CreatePostDto) {
  //   return this.postService.create(createPostDto);
  // }
  // @Get()
  // findAll() {
  //   return this.postService.findAll();
  // }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.postService.findOne(id);
  // }
  // @Patch(':id')
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(id, updatePostDto);
  // }
  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.postService.delete(id);
  // }
}

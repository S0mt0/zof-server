import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { Blog, BlogSchema } from './schema/blog.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/users/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [MongooseModule],
})
export class BlogsModule {}

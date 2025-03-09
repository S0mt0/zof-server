import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BlogContent, IBlog } from './blog.type';
import { transformSchema } from 'src/lib';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({
  timestamps: true,
  toJSON: transformSchema(['_id']),
})
export class Blog implements IBlog {
  @Prop({
    type: String,
    required: true,
    unique: true,
    default: function () {
      return syncBlogIdWithTitle(this.title);
    },
  })
  blogId: string;

  @Prop({ type: String, required: true, minlength: 5 })
  title: string;

  @Prop({ type: String, required: true })
  banner: string;

  @Prop({ type: String, required: true, minlength: 10 })
  desc: string;

  @Prop({ type: Boolean, default: false })
  featured: boolean;

  @Prop({ type: Boolean, default: true })
  draft: boolean;

  // @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  // publishedBy: Types.ObjectId;

  @Prop({
    type: {
      _id: false,
      blocks: [
        {
          _id: false,
          type: {
            type: String,
            enum: ['paragraph', 'header', 'list', 'image', 'quote'],
          },
          data: {
            style: { type: String, enum: ['unordered', 'ordered'] },
          },
        },
      ],
    },
    required: true,
  })
  content: BlogContent;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

export const syncBlogIdWithTitle = (title: string) =>
  title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-');

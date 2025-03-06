import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BlockType, IBlock, IBlockData, IBlog } from '../interface';

/** Define the block data schema */
@Schema({ _id: false })
export class BlockData extends Document implements IBlockData {
  @Prop()
  text?: string;

  @Prop()
  level?: number;

  @Prop({ enum: ['unordered', 'ordered'] })
  type?: 'unordered' | 'ordered';

  @Prop({ type: [String], default: undefined })
  items?: string[];

  @Prop({
    type: {
      url: String,
      size: Number,
      name: String,
      extension: String,
    },
  })
  file?: {
    url: string;
    size?: number;
    name?: string;
    extension?: string;
  };

  @Prop()
  withBorder?: boolean;

  @Prop()
  withBackground?: boolean;

  @Prop()
  stretched?: boolean;

  @Prop()
  caption?: string;

  @Prop()
  title?: string;

  @Prop({ type: Object })
  tunes?: Record<string, any>;
}

/** Define the block schema */
@Schema({ _id: false })
export class Block extends Document implements IBlock {
  @Prop({ required: true })
  id: string;

  @Prop({
    required: true,
    enum: ['paragraph', 'header', 'list', 'image', 'attaches'],
  })
  type: BlockType;

  @Prop({ type: BlockData })
  data: BlockData;
}

@Schema()
export class Blog extends Document implements IBlog {
  @Prop({ required: true })
  time: number;

  @Prop({ type: [Block], required: true })
  blocks: Block[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Relation with User
  user: Types.ObjectId;
}
/** Define the main Blog schema */
export type BlogDocument = Blog & Document;

export const BlogSchema = SchemaFactory.createForClass(Blog);

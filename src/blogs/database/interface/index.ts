import { Model, Types } from 'mongoose';

export type BlockType = 'paragraph' | 'header' | 'list' | 'image' | 'attaches';

export interface IBlockData {
  text?: string;
  level?: number;
  type?: 'unordered' | 'ordered';
  items?: string[];
  file?: {
    url: string;
    size?: number;
    name?: string;
    extension?: string;
  };
  withBorder?: boolean;
  withBackground?: boolean;
  stretched?: boolean;
  caption?: string;
  title?: string;
  tunes?: Record<string, any>;
}

export interface IBlock {
  id: string;
  type: BlockType;
  data: IBlockData;
}

export interface IBlog {
  time: number;
  blocks: IBlock[];
  user: Types.ObjectId;
}

import { Types } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlockType = 'paragraph' | 'header' | 'list' | 'image' | 'quote';

interface BlockData {
  text?: string;
  level?: number;
  style?: 'unordered' | 'ordered';
  items?: any[];
  file?: {
    url: string;
    size?: number;
    name?: string;
    extension?: string;

    [key: string]: any;
  };
  caption?: string;
  title?: string;

  [key: string]: any;
}

export interface Block {
  id: string;
  type: BlockType;
  data: BlockData;
}

export interface EventContent {
  blocks: Block[];
  time?: number;
  version?: string;
}

export interface IEvent {
  eventId: string;
  title: string;
  bannerUrl: string;
  desc: string;
  featured: boolean;
  draft: boolean;
  publishedBy?: Types.ObjectId;
  content: EventContent;
  scheduledFor: Date;
}

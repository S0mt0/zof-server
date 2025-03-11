import { Types } from 'mongoose';

export interface IEvent {
  eventId: string;
  title: string;
  banner: string;
  desc: string;
  featured: boolean;
  draft: boolean;
  location: string;
  timestamp: Date;
  publishedBy?: Types.ObjectId;
  more_details: string;
}

import { Types } from 'mongoose';

export interface IEvent {
  eventId: string;
  title: string;
  bannerUrl: string;
  desc: string;
  featured: boolean;
  draft: boolean;
  location: string;
  scheduledFor: Date;
  publishedBy?: Types.ObjectId;
  more_details: string;
}

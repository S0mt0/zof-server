import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { EventContent, IEvent } from './event.type';
import { transformSchema } from 'src/lib/utils';

export type EventDocument = HydratedDocument<Event>;

@Schema({
  timestamps: true,
  toJSON: transformSchema(['_id']),
  strict: false,
})
export class Event implements IEvent {
  @Prop({
    type: String,
    required: true,
    unique: true,
    default: function () {
      return syncEventIdWithTitle(this.title);
    },
  })
  eventId: string;

  @Prop({ type: String, required: true, minlength: 5, unique: true })
  title: string;

  @Prop({ type: String, required: true })
  bannerUrl: string;

  @Prop({ type: String, required: true, minlength: 10 })
  desc: string;

  @Prop({ type: Boolean, default: false })
  featured: boolean;

  @Prop({ type: Boolean, default: true })
  draft: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  publishedBy: Types.ObjectId;

  @Prop()
  scheduledFor: Date;

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
  content: EventContent;
}

export const EventSchema = SchemaFactory.createForClass(Event);

export const syncEventIdWithTitle = (title: string) =>
  title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-');

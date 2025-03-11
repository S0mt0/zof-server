import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { IEvent } from './event.type';
import { transformSchema } from 'src/lib';

export type EventDocument = HydratedDocument<Event>;

@Schema({
  timestamps: true,
  toJSON: transformSchema(['_id']),
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

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: String, required: true })
  more_details: string;

  @Prop({ type: Date, required: true })
  timestamp: Date;
  // @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  // publishedBy: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);

export const syncEventIdWithTitle = (title: string) =>
  title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-');

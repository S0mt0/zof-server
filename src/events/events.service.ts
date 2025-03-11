import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto, ParseEventQueryDto, UpdateEventDto } from './dto';
import { Event, syncEventIdWithTitle } from './schema/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  create(dto: CreateEventDto) {
    return this.eventModel.create(dto);
  }

  async findByEventId(eventId: string) {
    const event = await this.eventModel.findOne({ eventId });

    if (!event) throw new NotFoundException('Event post not found.');

    return event;
  }

  async findAll(query: ParseEventQueryDto) {
    const {
      title,
      eventId,
      sort,
      fields,
      draft,
      location,
      featured,
      page,
      timestamp,
      limit,
    } = query;

    const filter: Record<string, any> = {};

    if (title) {
      filter.title = new RegExp(title, 'i');
    }

    if (eventId) {
      filter.eventId = eventId;
    }

    if (draft !== undefined) {
      filter.draft = draft;
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    if (location) {
      filter.location = location;
    }

    if (timestamp) {
      filter.timestamp = timestamp;
    }

    const fieldsList = fields ? fields.split(',').join(' ') : '';

    const skip = (page - 1) * limit;

    const events = await this.eventModel
      .find(filter)
      .sort(sort)
      .select(fieldsList)
      .skip(skip)
      .limit(limit);

    const totalCount = await this.eventModel.countDocuments(filter);

    return {
      events,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async update(eventId: string, dto: UpdateEventDto) {
    if (dto.title) {
      dto = {
        ...dto,
        eventId: syncEventIdWithTitle(dto.title),
      } as UpdateEventDto;
    }

    const event = await this.eventModel.findOneAndUpdate({ eventId }, dto, {
      runValidators: true,
      new: true,
    });

    if (!event) throw new NotFoundException('Event post not found.');

    return event;
  }

  delete(eventId: string) {
    return this.eventModel.findOneAndDelete({ eventId });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto, ParseEventQueryDto, UpdateEventDto } from './dto';
import { Event, syncEventIdWithTitle } from './schema/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(dto: CreateEventDto, userId: string) {
    const event = await this.eventModel.create(dto);
    event.publishedBy = userId as any;

    return event;
  }

  async findByEventId(eventId: string) {
    const event = await this.eventModel.findOne({ eventId });

    if (!event) throw new NotFoundException('Event not found.');

    return event;
  }

  async findAll(query: ParseEventQueryDto) {
    const { sort, fields, draft, featured, page, limit } = query;

    const filter: Record<string, any> = {};

    if (draft !== undefined) {
      filter.draft = draft;
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    if (location) {
      filter.location = location;
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

    if (!event) throw new NotFoundException('Event not found.');

    return event;
  }

  delete(eventId: string) {
    return this.eventModel.findOneAndDelete({ eventId });
  }
}

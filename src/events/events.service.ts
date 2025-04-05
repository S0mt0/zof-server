import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as stream from 'stream';

import { Event, syncEventIdWithTitle } from './schema/event.schema';
import { CreateEventDto, ParseEventQueryDto, UpdateEventDto } from './dto';
import { cloudinary } from 'src/lib/config';
import { CLOUDINARY_UPLOAD_PRESET } from 'src/lib/constants';

@Injectable()
export class EventsService {
  u_preset: string;

  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private configService: ConfigService,
  ) {
    this.u_preset = this.configService.get(CLOUDINARY_UPLOAD_PRESET);
  }

  async create(dto: CreateEventDto, userId: string) {
    const eventExists = await this.eventModel.exists({
      title: new RegExp(dto.title, 'i'),
    });

    if (eventExists)
      throw new ConflictException(
        'Event with the same title already exists. Choose a different title.',
      );

    const event = await this.eventModel.create({ ...dto, publishedBy: userId });

    return event;
  }

  async findByEventId(eventId: string): Promise<Event | undefined> {
    const event = await this.eventModel.findOne({ eventId });

    if (!event) throw new NotFoundException('Event not found.');

    return event;
  }

  async findAll(query: ParseEventQueryDto) {
    const { sort, fields, draft, featured, page, limit, title } = query;

    const filter: Record<string, any> = {};

    if (draft !== undefined) {
      filter.draft = draft;
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    if (title !== undefined) {
      if (title.trim().length) filter.title = new RegExp(title, 'i');
    }

    const fieldsList = fields ? fields.split(',').join(' ') : '';

    const skip = (page - 1) * limit;

    const events = await this.eventModel
      .find(filter)
      .sort(sort)
      .select(fieldsList)
      .skip(skip)
      .limit(limit > 10 ? 10 : limit);

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
        eventId: syncEventIdWithTitle(dto.title.trim()),
      } as UpdateEventDto;
    }

    const event = await this.eventModel.findOneAndUpdate({ eventId }, dto, {
      runValidators: true,
      new: true,
    });

    if (!event) throw new NotFoundException('Event not found.');

    return event;
  }

  async uploadBanner(file: Express.Multer.File) {
    const allowedFileTypes = ['image/jpg', 'image/png', 'image/jpeg'];
    const maxFileSize = 2000000; // 2MB

    if (!allowedFileTypes.includes(file.mimetype))
      throw new UnprocessableEntityException('File type unsupported');

    if (file.size > maxFileSize)
      throw new UnprocessableEntityException('File size too large');
    const public_id = `IMG_${Date.now()}`;

    const uploadStream = new stream.PassThrough();
    uploadStream.end(file.buffer);

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          upload_preset: this.u_preset,
          resource_type: 'image',
          public_id,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url });
        },
      );

      uploadStream.pipe(upload);
    });
  }

  async deleteFile(url: string) {
    const parts = url?.split('/');
    let fileName = '';

    if (parts) fileName = parts[parts?.length - 1].split('.')[0];

    const old_public_id = `${this.u_preset}/${fileName}`;
    await cloudinary.uploader.destroy(old_public_id, {
      invalidate: true,
      resource_type: 'image',
    });
  }

  async delete(eventId: string) {
    await this.eventModel.findOneAndDelete({ eventId });

    return 'Event deleted';
  }
}

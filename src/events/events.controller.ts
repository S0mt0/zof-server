import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ParseBlogQueryDto } from 'src/blogs/dto';
import { Message } from 'src/lib/decorators';
import { CreateEventDto, UpdateEventDto } from './dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createBlogDto: CreateEventDto) {
    return this.eventsService.create(createBlogDto);
  }

  @Get()
  findAll(@Query() query: ParseBlogQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Get(':eventId')
  findByBlogId(@Param('eventId') blogId: string) {
    return this.eventsService.findByEventId(blogId);
  }

  @Message('Event updated')
  @Patch(':eventId')
  update(
    @Param('eventId') blogId: string,
    @Body() updateBlogDto: UpdateEventDto,
  ) {
    return this.eventsService.update(blogId, updateBlogDto);
  }

  @Message('Event deleted')
  @Delete(':eventId')
  delete(@Param('eventId') blogId: string) {
    return this.eventsService.delete(blogId);
  }
}

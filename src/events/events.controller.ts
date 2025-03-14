import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { ParseEventQueryDto } from './dto';
import { Message, Protect, Public } from 'src/lib/decorators';
import { CreateEventDto, UpdateEventDto } from './dto';
import { EventsService } from './events.service';

@Protect()
@Message()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createBlogDto: CreateEventDto, @Req() req: Request) {
    return this.eventsService.create(createBlogDto, req.user['_id']);
  }

  @Public()
  @Get()
  findAll(@Query() query: ParseEventQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Public()
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

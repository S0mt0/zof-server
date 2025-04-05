import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseInterceptors,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Message, Protect, Public } from 'src/lib/decorators';
import { ParseEventQueryDto } from './dto';

@Protect()
@Message()
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() req: Request) {
    return this.eventsService.create(createEventDto, req.user['_id']);
  }

  @Public()
  @Get()
  findAll(@Query() query: ParseEventQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Public()
  @Get(':eventId')
  findByEventId(@Param('eventId') eventId: string) {
    return this.eventsService.findByEventId(eventId);
  }

  @Message('Event updated')
  @Patch(':eventId')
  update(
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(eventId, updateEventDto);
  }

  @Message('Image uploaded🎉')
  @Public()
  @Put('upload-img')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.eventsService.uploadBanner(file);
  }

  @Delete(':eventId')
  delete(@Param('eventId') eventId: string) {
    return this.eventsService.delete(eventId);
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EventsController } from './events.controller';
import { EventSchema } from './schema/event.schema';
import { EventsService } from './events.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/users/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [MongooseModule],
})
export class EventsModule {}

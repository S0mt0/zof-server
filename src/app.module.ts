import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './lib/database/database.module';
import { AppCacheModule } from './lib/cache/cache.module';
import { TIME_IN } from './lib/constants';
import { BlogsModule } from './blogs/blogs.module';
import { MailModule } from './mailer/mailer.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AppConfigModule } from './lib/config';
import { ResponseInterceptor } from './lib/interceptors';
import { EventsService } from './events/events.service';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AppCacheModule,
    ThrottlerModule.forRoot([
      {
        ttl: TIME_IN.minutes[1],
        limit: 100,
      },
    ]),
    BlogsModule,
    UsersModule,
    AuthModule,
    BlogsModule,
    MailModule,
    CloudinaryModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    EventsService,
  ],
})
export class AppModule {}

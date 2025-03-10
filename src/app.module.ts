import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './lib/database/database.module';
import { AppCacheModule } from './lib/cache/cache.module';
import { TIME_IN } from './lib/constants';
import { BlogsModule } from './blogs/blogs.module';
import { AppConfigModule } from './lib/config';
import { ResponseInterceptor } from './lib/interceptors';

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
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}

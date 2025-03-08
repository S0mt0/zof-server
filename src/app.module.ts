import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './lib/database/database.module';
import { AppCacheModule } from './lib/cache/cache.module';
import { TIME_IN } from './lib/constants';
import { PostsModule } from './posts/posts.module';
import { MailModule } from './mailer/mailer.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { BlogsModule } from './blog/blogs.module';
import { AppConfigModule } from './lib/config';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AppCacheModule,
    ThrottlerModule.forRoot([
      {
        ttl: TIME_IN.minutes[1],
        limit: 100, // Max 100 requests per minute
      },
    ]),
    BlogsModule,
    UsersModule,
    AuthModule,
    PostsModule,
    MailModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

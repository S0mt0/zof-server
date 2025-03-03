import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './lib/database/database.module';
import { AppConfigModule } from './lib/config/config.module';
import { AppCacheModule } from './lib/cache/cache.module';
import { TIME_IN } from './lib/constants';
import { PostsModule } from './posts/posts.module';
import { MailModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AppCacheModule,
    ThrottlerModule.forRoot([
      {
        ttl: TIME_IN.minutes[1],
        limit: 100, // Max 100 requests per minute
      },
    ]),
    UsersModule,
    AuthModule,
    PostsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

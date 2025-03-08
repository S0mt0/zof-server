import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseService } from './database.service';
import { DATABASE_URL } from '../constants';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get(DATABASE_URL),
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [MongooseModule],
})
export class DatabaseModule {}

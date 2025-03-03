import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
    }),
  ],
  providers: [DatabaseService],
  exports: [MongooseModule],
})
export class DatabaseModule {}

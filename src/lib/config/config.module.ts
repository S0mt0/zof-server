import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv-flow';

import { validate } from './env.validation';

config({
  debug: process.env.NODE_ENV !== 'production',
  default_node_env: 'development',
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      cache: true,
    }),
  ],
})
export class AppConfigModule {}

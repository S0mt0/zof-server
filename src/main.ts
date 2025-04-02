import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { cloudinaryConfig, corsOptions } from './lib/config';
import { PORT } from './lib/constants';
import { AllExceptionsFilter } from './lib/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1/');

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors(corsOptions);

  cloudinaryConfig();
  const config = app.get(ConfigService);

  await app.listen(config.get(PORT, 5000));
}

bootstrap();

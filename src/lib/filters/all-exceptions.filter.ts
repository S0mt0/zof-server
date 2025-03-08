import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { Error } from 'mongoose';
import { MongoServerError } from 'mongodb';

type TAppErrorResponse = {
  statusCode: number;
  path: string;
  method: string;
  response: string | object;
  timestamp: string;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse: TAppErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      response: 'Something Unexpected happened. Please Try Again.',
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    if (exception instanceof HttpException) {
      errorResponse.statusCode = exception.getStatus();
      errorResponse.response = exception.getResponse();
    }

    if (exception instanceof Error.ValidationError) {
      errorResponse.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      errorResponse.response =
        exception.message.split(':')[0] || 'Validation failed, try again.';
    }

    if (exception instanceof Error.DocumentNotFoundError) {
      errorResponse.statusCode = HttpStatus.NOT_FOUND;
      errorResponse.response = exception.message;
    }

    if (exception instanceof MongoServerError && exception.code === 11000) {
      errorResponse.statusCode = HttpStatus.CONFLICT;
      errorResponse.response =
        'Duplicate key error: A record with this value already exists.';
    }

    response.status(errorResponse.statusCode).json(errorResponse);

    super.catch(exception, host);
  }
}

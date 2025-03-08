import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MESSAGE } from '../decorators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const message = this.reflector.getAllAndOverride<string>(MESSAGE, [
          context.getHandler(),
          context.getClass(),
        ]);

        if (typeof data === 'string' && data.trim().length)
          return {
            statusCode: res.statusCode,
            response: data,
            timestamp: new Date().toISOString(),
          };

        return {
          statusCode: res.statusCode,
          response: message,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}

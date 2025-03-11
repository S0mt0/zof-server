import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

export const ParsedJWTCookie = createParamDecorator(
  (key: string = 'jwt', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const cookie = request.cookies[key];

    if (!cookie) throw new ForbiddenException();

    return cookie;
  },
);

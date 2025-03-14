import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthenticationGuard } from '../guards/auth.guard';

export const ParsedJWTCookie = createParamDecorator(
  (key: string = 'jwt', ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const cookie = request.cookies[key];

    if (!cookie) throw new ForbiddenException('Session expired, try again.');

    return cookie;
  },
);

export const MESSAGE_KEY = 'message';

export const Message = (message: string = 'Success') =>
  SetMetadata(MESSAGE_KEY, message);

export const PUBLIC_KEY = 'IS_PUBLIC';

export const Public = () => SetMetadata(PUBLIC_KEY, true);

export const Protect = () => {
  return applyDecorators(UseGuards(AuthenticationGuard));
};

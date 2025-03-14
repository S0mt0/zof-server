import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { PUBLIC_KEY } from '../decorators';
import { extractAuthHeader } from '../utils';
import { UsersService } from 'src/users/users.service';
import { CacheService } from '../cache/cache.service';
import { SESSION_USER } from '../constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
    private jwtService: JwtService,
    private cache: CacheService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) return isPublic;

    const request = context.switchToHttp().getRequest<Request>();

    let token: string;
    try {
      token = extractAuthHeader(request);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    let decoded: { sub: string; email: string };
    try {
      decoded = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired, please log in again.');
      }
      throw new UnauthorizedException('Invalid token.');
    }

    if (!decoded || !decoded.sub || !decoded.email)
      throw new UnauthorizedException('Session expired, please log in again.');

    const user =
      (await this.cache.get(SESSION_USER(decoded.sub))) ??
      (await this.usersService.findUserById(decoded.sub));

    if (!user) throw new NotFoundException('User not found!');

    request.user = user;

    return true;
  }
}

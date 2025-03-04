import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGY } from '../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard(STRATEGY.jwt) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGY } from '../constants';

@Injectable()
class JwtAuthenticationGuard extends AuthGuard(STRATEGY.jwt) {
  constructor() {
    super();
  }
}

export const JwtAuthGuard = () => UseGuards(JwtAuthenticationGuard);

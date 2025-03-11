import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class JwtAuthenticationGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}

export const JwtAuthGuard = () => UseGuards(JwtAuthenticationGuard);

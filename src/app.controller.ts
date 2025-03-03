import { Controller, Req, Post, Get } from '@nestjs/common';

import { JwtAuthGuard, LocalAuthGuard } from './auth/guards';
import { AuthService } from './auth/auth.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  // @LocalAuthGuard()
  // @Post('auth/login')
  // async login(@Req() req: Request) {
  //   return this.authService.login(req.user);
  // }

  // @JwtAuthGuard()
  // @Get('profile')
  // getProfile(@Req() req: Request) {
  //   return req.user;
  // }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return 'helllo';
  }
}

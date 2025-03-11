import { Controller, Delete, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from './auth/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @JwtAuthGuard()
  async getMe(@Req() req: Request) {
    return req.user;
  }

  @Delete('me')
  @JwtAuthGuard()
  async deletMe(@Req() req: Request) {
    return this.usersService.delete(req.user['_id']);
  }
}

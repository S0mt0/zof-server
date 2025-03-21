import { Controller, Delete, Get, Req, Patch, Body } from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { Message, Protect } from 'src/lib/decorators';

@Message()
@Protect()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: Request) {
    return req.user;
  }

  @Delete('me')
  async deletMe(@Req() req: Request) {
    return this.usersService.delete(req.user['_id']);
  }

  @Message('Profile updated🎉')
  @Patch('me')
  async updateMe(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.usersService.update(req.user['_id'], updateUserDto);
  }
}

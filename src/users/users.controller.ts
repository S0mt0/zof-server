import {
  Controller,
  Delete,
  Get,
  Req,
  Patch,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { Message, ParsedJWTCookie, Protect } from 'src/lib/decorators';
import { RF_TOKEN_COOKIE_KEY } from 'src/lib/constants';

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

  @Message('Logout successful')
  @Get('me/logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @ParsedJWTCookie(RF_TOKEN_COOKIE_KEY) refresh_token: string,
  ) {
    // Is refresh_token in db?
    const session = await this.usersService.findByRefreshToken(refresh_token);

    if (!session) {
      // If no valid session was found, clear cookies for whatever session is active
      res.clearCookie(RF_TOKEN_COOKIE_KEY);
      res.status(HttpStatus.NO_CONTENT);
      return 'Session expired, please log in again.';
    }

    session.refresh_token = '';

    await session.save().then(async (user) => {
      await this.usersService.removeSession(user.id);
    });

    res.clearCookie(RF_TOKEN_COOKIE_KEY);
    res.status(HttpStatus.NO_CONTENT);
  }

  @Get('me/refresh-token')
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Res() req: Request,
    @ParsedJWTCookie(RF_TOKEN_COOKIE_KEY) refresh_token: string,
  ) {
    // Is refresh_token in db?
    const session = await this.usersService.findByRefreshToken(refresh_token);

    if (!session) {
      res.status(HttpStatus.FORBIDDEN);
      return 'Session expired, please log in again.';
    }

    const access_token = await this.usersService.refreshToken({
      email: req.user['email'],
      userId: req.user['_id'],
    });

    // Set access token
    res.setHeader('Authorization', access_token);
    res.status(HttpStatus.OK);

    return req.user;
  }
}

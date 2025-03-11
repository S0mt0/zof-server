import { Body, Controller, Get, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import {
  LoginUserDto,
  NewPasswordDto,
  ForgotPasswordDto,
  ResetPasswordDTO,
} from './dto';
import {
  JWT_REFRESH_TOKEN_EXP,
  NODE_ENV,
  NP_COOKIE_KEY,
  RP_COOKIE_KEY,
  TIME_IN,
} from 'src/lib/constants';
import { Message, ParsedJWTCookie } from 'src/lib/decorators';
import { CreateUserDto } from '../dto';

@Message()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('sign-up')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Message('Welcome back!')
  @Post('sign-in')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.login(loginUserDto);

    // Set access token
    res.setHeader('Authorization', access_token);

    // Set refresh token
    res.cookie('refresh_token', refresh_token, {
      secure: this.configService.get(NODE_ENV) === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: this.configService.get(JWT_REFRESH_TOKEN_EXP),
    });

    return user;
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.forgotPassword(forgotPasswordDto);

    res.cookie(RP_COOKIE_KEY, token, {
      secure: this.configService.get(NODE_ENV) === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: TIME_IN.minutes[15],
    });

    return 'A code was sent to your email. Use it to reset your password.';
  }

  @Post('verify-pr-code')
  async verifyPRCode(
    @ParsedJWTCookie(RP_COOKIE_KEY) jwt: string,
    @Body() resetPasswordDTO: ResetPasswordDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.verifyPRCode(resetPasswordDTO, jwt);

    res.cookie(NP_COOKIE_KEY, token, {
      secure: this.configService.get(NODE_ENV) === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: TIME_IN.minutes[15],
    });

    return 'You rock! Now, create a new password.';
  }

  @Put('reset-password')
  async resetPassword(
    @ParsedJWTCookie(RP_COOKIE_KEY) jwt: string,
    @Body() newPasswordDto: NewPasswordDto,
  ) {
    return this.authService.resetPassword(newPasswordDto, jwt);
  }

  @Get('resend-pr-code')
  async resendPRCode(
    @Res({ passthrough: true }) res: Response,
    @ParsedJWTCookie(RP_COOKIE_KEY) jwt: string,
  ) {
    const token = await this.authService.resendPRCode(jwt);

    res.cookie(RP_COOKIE_KEY, token, {
      secure: this.configService.get(NODE_ENV) === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: TIME_IN.minutes[15],
    });

    return 'Code sent!🎉';
  }
}

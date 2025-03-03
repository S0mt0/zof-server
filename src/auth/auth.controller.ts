import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthHeaderInterceptor } from './auth-header.interceotor';
import { CreateUserDto } from '../users/dto';
import { AuthService } from './auth.service';
import { UserDocument } from 'src/users/database/interface';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserDto } from './dto';
import { TIME_IN, accounts } from 'src/lib/constants';
import { ForgotPasswordUserDto } from './dto/forgot-pasword-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}
  // @UseInterceptors(AuthHeaderInterceptor)

  @Get('verify-email')
  async verifyEmail(
    @Body('verification_code') VerifyEmailCodeDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Extract token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Missing Authorization header');

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer "
    if (!token) throw new UnauthorizedException('Invalid Authorization header');

    //  Decode token (assuming JWT is used)
    const { error, data } = this.authService.verifyJwtToken(token); // You need a method to decode JWT
    // console.log(data);
    if (error) throw new UnauthorizedException(error);
    // Verify email using the verification code
    const result = await this.authService.verifyEmail(VerifyEmailCodeDTO, data);

    // Set the new access token in the response header
    res.setHeader('Authorization', result.accessToken);

    return res.status(201).json({
      success: true,
      message: 'Email verification successful',
      data: { user: result.user },
    });
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const response = await this.authService.login(loginUserDto);

    if (!response.success) {
      res.setHeader('Authorization', response.token);
      return res.status(403).json(response);
    }

    const refreshTokenExpiresIn = TIME_IN.hours[1];
    // set cookies, for web-based admin accounts

    if (response.data.account_type === accounts.ADMIN) {
      res.cookie('refresh_token', response.data.refresh_token, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: refreshTokenExpiresIn,
      });
    }
    res.setHeader('Authorization', response.token);
    return res.status(200).json(response);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordUserDto: ForgotPasswordUserDto,
    @Res() res: Response,
  ) {
    const response = await this.authService.forgotPassword(
      forgotPasswordUserDto,
    );

    res.setHeader('Authorization', response.token);
    return res.status(200).json(response);
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import {
  LoginUserDto,
  NewPasswordDto,
  ForgotPasswordUserDto,
  ResetPasswordUserDTO,
} from './dto';
import { TIME_IN, accounts } from 'src/lib/constants';
import { LocalAuthGuard } from './guards';

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
    const { error, data } = this.authService.verifyJwtToken(token);
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
  @UseGuards(LocalAuthGuard)
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

  @Post('verify-password-reset-code')
  async verifyPasswordResetCode(
    @Body() resetPasswordUserDTO: ResetPasswordUserDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // Extract token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Missing Authorization header');

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer "
    if (!token) throw new UnauthorizedException('Invalid Authorization header');

    //  Decode token (assuming JWT is used)
    const { error, data } = this.authService.verifyJwtToken(token);
    // console.log(data);
    if (error) throw new UnauthorizedException(error);
    const response = await this.authService.verifyPasswordResetCode(
      resetPasswordUserDTO,
      data,
    );

    res.setHeader('Authorization', response.accessToken);
    return res.status(200).json({
      success: true,
      message: "You rock! Now, let's create you a new password.",
    });
  }

  @Put('reset-password')
  async passwordReset(
    @Body() newPasswordDto: NewPasswordDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // Extract token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Missing Authorization header');

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer "
    if (!token) throw new UnauthorizedException('Invalid Authorization header');

    //  Decode token (assuming JWT is used)
    const { error, data } = this.authService.verifyJwtToken(token);
    // console.log(data);
    if (error) throw new UnauthorizedException(error);
    if (!data.userId) throw new UnauthorizedException(error);

    const { accessToken, user } = await this.authService.resetPassword(
      newPasswordDto,
      data,
    );

    res.setHeader('Authorization', accessToken);
    return res.status(200).json({
      success: true,
      message: 'Voila! Your password was changed successfully',
      data: { user },
    });
  }

  @Get('password/resend-code')
  async resendPasswordResetCode(@Res() res: Response, @Req() req: Request) {
    // Extract token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Missing Authorization header');

    const token = authHeader.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid Authorization header');

    //  Decode token (assuming JWT is used)
    const { error, data } = this.authService.verifyJwtToken(token);

    if (error) throw new UnauthorizedException(error);
    if (!data.email) throw new UnauthorizedException(error);

    const { accessToken, message } =
      await this.authService.resendPasswordResetCode(data);

    res.setHeader('Authorization', accessToken);
    return res.status(200).json({
      success: true,
      message,
    });
  }

  @Get('email/resend-code')
  async resendEmailVerificationCode(@Res() res: Response, @Req() req: Request) {
    // Extract token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Missing Authorization header');

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer "
    if (!token) throw new UnauthorizedException('Invalid Authorization header');

    //  Decode token (assuming JWT is used)
    const { error, data } = this.authService.verifyJwtToken(token);

    if (error) throw new UnauthorizedException(error);
    if (!data.email) throw new UnauthorizedException(error);

    const { accessToken, message } =
      await this.authService.resendEmailVerificationCode(data);

    res.setHeader('Authorization', accessToken);
    return res.status(200).json({
      success: true,
      message,
    });
  }
}

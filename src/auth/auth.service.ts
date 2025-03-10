/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { TIME_IN, accounts } from 'src/lib/constants';
import { LoginUserDto } from './dto';
import { MailService } from 'src/mailer/mailer.service';
import {
  emailVerificationResendTemplate,
  newPasswordSuccessTemplate,
  obscureEmail,
  resetPasswordTemplate,
} from 'src/lib';
import {
  ForgotPasswordUserDto,
  NewPasswordDto,
  ResetPasswordUserDTO,
} from './dto';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class AuthService {
  private token: string | null;
  private code: string | number | null;
  private session: any;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailService,
  ) {
    this.token = null;
    this.code = null;
    this.session = null;
  }

  /**
   * @note Authentication is the process of *verifying* the **identity** of the client making a request to the server. This `function` therefore is for validating the provided `data` against the database.
   * @param data *{ email, password }*
   * @returns User Document
   */
  public async validateUser(email: string, password: string) {
    const foundUser = await this.usersService.findByEmail(email);

    if (!foundUser)
      throw new UnauthorizedException(`Invalid email or password!`);

    const passwordIsValid = await foundUser.verifyPassword(password);

    if (!passwordIsValid)
      throw new UnauthorizedException(`Invalid email or password!`);

    return foundUser;
  }

  /**
   * Verifies a JWT token and returns the decoded data if verified, or an error message if token fails verification
   * @param token The JWT token to verify
   * @param options Optional message for expired tokens
   * @returns { data: any } OR { error: string }
   */
  public verifyJwtToken(
    token: string,
    options?: { message?: string },
  ): { data?: any; error?: string } {
    try {
      const secret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');

      const data = this.jwtService.verify(token, { secret });

      if (data && typeof data !== 'string') {
        return { data };
      }
    } catch (err) {
      let message = 'Invalid Token.';

      if (err?.message?.toLowerCase()?.includes('expired')) {
        message =
          options?.message ||
          'Hey champ! Your session expired, please login again.';
      }

      return { error: message };
    }
  }

  public async verifyEmail(
    verificationCode: string,
    decoded: any,
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.usersService.authenticateEmail({
      ...decoded,
      verificationCode,
    });

    const accessToken = user.createAccessToken();
    return { accessToken, user };
  }

  public async login(loginUserDto: LoginUserDto) {
    const { account_type, email, password } = loginUserDto;
    switch (account_type) {
      case accounts.User:
      case accounts.ADMIN:
        const user_doc = await this.validateUser(email, password);

        const accessTokenExpiresIn =
          user_doc.account_type === accounts.ADMIN ? TIME_IN.minutes[5] : null;

        this.token = user_doc.createAccessToken(accessTokenExpiresIn);
        this.session = user_doc;
        break;

      default:
        throw new BadRequestException('Provided account type is not supported');
        break;
    }

    // Check if email of user trying to login is verified. If it is not yet verified, mail them a verification code instead,else log them in.
    if (!this.session.verified_email) {
      const { code, email, token } =
        this.session.createEmailVerificationToken();

      const mailOptions = emailVerificationResendTemplate(
        this.session.fullName,
        code,
      );

      await this.mailerService.viaNodemailer({
        ...mailOptions,
        to: email,
      });

      return {
        success: true,
        message: `Your email has not been verified. Use the code that was sent to ${obscureEmail(this.session.emaill)}`,
        token,
      };
    }

    if (this.session?.account_type === accounts.ADMIN) {
      const refreshTokenExpiresIn = TIME_IN.hours[1];

      const refresh_token = this.session.createAccessToken(
        refreshTokenExpiresIn,
      );

      this.session.refresh_token = refresh_token;
      await this.session.save();

      return {
        token: this.token,
        success: true,
        message: 'Login successful',
        data: this.session,
      };
    }

    if (this.session?.account_type === accounts.User) {
      const refresh_token = this.session.createAccessToken();

      this.session.refresh_token = refresh_token;
      await this.session.save();

      return {
        token: this.token,
        success: true,
        message: 'Login successful',
        data: this.session,
      };
    }
  }

  /**
   * Handles initialization of request to reset password for `user` and `admin`` account types
   * @route {POST} /api/v1/auth/forgot-password
   * @access public
   */
  public forgotPassword = async (
    forgotPasswordUserDto: ForgotPasswordUserDto,
  ) => {
    const { email, account_type } = forgotPasswordUserDto;

    switch (account_type) {
      case accounts.User:
      case accounts.ADMIN:
        const u_doc = await this.usersService.findByEmail(email);

        const a_reset_data = u_doc.createResetPasswordToken();

        this.session = u_doc;
        this.code = a_reset_data.code;
        this.token = a_reset_data.token;

        const mailOptions = resetPasswordTemplate(
          this.session.fullName,
          this.code,
        );

        await this.mailerService.viaNodemailer({
          ...mailOptions,
          to: this.session.email,
        });

        return {
          success: true,
          token: this.token,
          message: `A code has been sent to ${obscureEmail(this.session.email)}`,
        };
      default:
        throw new BadRequestException('Provided account type is not supported');
        break;
    }
  };

  public verifyPasswordResetCode = async (
    resetPasswordUserDTO: ResetPasswordUserDTO,
    data: any,
  ) => {
    const payload = resetPasswordUserDTO;
    switch (data.account_type) {
      case accounts.User:
      case accounts.ADMIN:
        const u_token = await this.usersService.verifyPasswordResetCode({
          ...data,
          ...payload,
        });

        this.token = u_token;
        return { accessToken: this.token };

      default:
        throw new BadRequestException('Provided account type is not supported');
    }
  };

  /**
   * Handles resetting forgotten password
   * @route {PUT} /api/v1/auth/reset-password
   * @access public
   */
  public resetPassword = async (newPasswordDto: NewPasswordDto, data: any) => {
    const payload = newPasswordDto;
    switch (data.account_type) {
      case accounts.User:
      case accounts.ADMIN:
        const u_doc = await this.usersService.resetPassword({
          ...data,
          ...payload,
        });

        this.session = u_doc;

        const mailOptions = newPasswordSuccessTemplate(this.session.fullName);

        await this.mailerService.viaNodemailer({
          ...mailOptions,
          to: this.session.email,
        });

        return { accessToken: this.token, user: this.session };

      default:
        throw new BadRequestException('Provided account type is not supported');
        break;
    }
  };

  /**
   * Handles request to resend code used to initiate resetting forgotten password
   * @route {GET} /api/v1/auth/password/resend-code
   * @access public
   */
  public resendPasswordResetCode = async (data: any) => {
    switch (data.account_type) {
      case accounts.User:
      case accounts.ADMIN:
        const u_doc = await this.usersService.findByEmail(data.email);

        const u_reset_data = u_doc.createResetPasswordToken();

        this.session = u_doc;
        this.code = u_reset_data.code;
        this.token = u_reset_data.token;

        const mailOptions = resetPasswordTemplate(
          this.session.fullName,
          this.code,
        );

        await this.mailerService.viaNodemailer({
          ...mailOptions,
          to: this.session.email,
        });
        return {
          success: true,
          message: `A code has been sent to ${obscureEmail(this.session.email)}`,
          accessToken: this.token,
        };

      default:
        throw new BadRequestException('Provided account type is not supported');
        break;
    }
  };

  /**
   * Handles request to resend email verification code
   * @route {GET} /api/v1/auth/email/resend-code
   * @access public
   */
  public resendEmailVerificationCode = async (data: any) => {
    switch (data.account_type) {
      case accounts.User:
      case accounts.ADMIN:
        const u_doc = await this.usersService.findByEmail(data.email);

        const u_reset_data = u_doc.createEmailVerificationToken();

        this.session = u_doc;
        this.code = u_reset_data.code;
        this.token = u_reset_data.token;

        const mailOptions = emailVerificationResendTemplate(
          this.session.fullName,
          this.code,
        );

        await this.mailerService.viaNodemailer({
          ...mailOptions,
          to: this.session.email,
        });

        return {
          success: true,
          message: `A code has been sent to ${obscureEmail(this.session.email)}`,
          accessToken: this.token,
        };

      default:
        throw new BadRequestException('Provided account type is not supported');
        break;
    }
  };
}

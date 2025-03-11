import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import randomize from 'randomatic';
import { ConfigService } from '@nestjs/config';

import {
  JWT_REFRESH_TOKEN_EXP,
  JWT_REFRESH_TOKEN_SECRET,
  NP_TOKEN,
  RP_TOKEN,
  REFRESH_TOKEN,
  TIME_IN,
} from 'src/lib/constants';
import { LoginUserDto, NewPasswordDto, ResetPasswordDTO } from './dto';
import { ForgotPasswordDto } from './dto';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto';
import { CacheService } from 'src/lib/cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cache: CacheService,
  ) {}

  async signUp(dto: CreateUserDto) {
    await this.usersService.create(dto);
    return 'Registration complete, please log in.';
  }

  async login(dto: LoginUserDto) {
    const user = await this.usersService.findUserByEmail(dto.email);

    if (!user) {
      console.error(`User not found for email: ${dto.email}`);
      throw new ForbiddenException('Invalid credentials');
    }

    const isCorrectPassword = await user.verifyPassword(dto.password);

    if (!isCorrectPassword) {
      console.error(`Invalid password for user: ${user._id}`);
      throw new ForbiddenException('Invalid credentials');
    }

    const access_token = await this.jwtService.signAsync({
      sub: user._id,
      email: user.email,
    });

    const refresh_token = await this.jwtService.signAsync(
      {
        sub: user._id,
        email: user.email,
      },
      {
        secret: this.configService.get(JWT_REFRESH_TOKEN_SECRET),
        expiresIn: this.configService.get(JWT_REFRESH_TOKEN_EXP),
      },
    );

    user.refresh_token = refresh_token;
    await user.save();

    await this.cache.set(REFRESH_TOKEN(user._id.toString()), refresh_token);
    console.log(
      'rft: ',
      await this.cache.get(REFRESH_TOKEN(user._id.toString())),
    );

    return { user, access_token, refresh_token };
  }

  async verifyPRCode(dto: ResetPasswordDTO, jwt: string) {
    const decoded = await this.jwtService.verifyAsync<{
      code: string;
      email: string;
    }>(jwt);

    const user = await this.usersService.findUserByEmail(decoded.email);

    if (!user)
      throw new ForbiddenException(
        `User with email, ${decoded.email} doesn't exist!`,
      );

    const cached = await this.cache.get<string>(RP_TOKEN(user._id.toString()));

    if (!cached) throw new ForbiddenException('That code expired, try again.');

    if (decoded.code !== dto.rp_code)
      throw new ForbiddenException('Invalid code, try again.');

    const token = await this.jwtService.signAsync(
      {
        email: user.email,
      },
      { expiresIn: TIME_IN.minutes[15] },
    );

    await this.cache.set(
      NP_TOKEN(user._id.toString()),
      token,
      TIME_IN.minutes[15],
    );

    return token;
  }

  async resetPassword(dto: NewPasswordDto, jwt: string) {
    const decoded = await this.jwtService.verifyAsync<{
      code: string;
      email: string;
    }>(jwt);

    const user = await this.usersService.findUserByEmail(decoded.email);

    if (!user)
      throw new ForbiddenException(
        `User with email, ${decoded.email} doesn't exist!`,
      );

    const cached = await this.cache.get<string>(NP_TOKEN(user._id.toString()));

    if (!cached) throw new ForbiddenException('That code expired, try again.');

    if (dto.new_password !== dto.confirm_password)
      throw new ForbiddenException('Passwords do not match!');

    user.password = dto.new_password;
    await user.save();

    return 'Voila! Your password has been updated!';
  }

  forgotPassword = async (dto: ForgotPasswordDto) => {
    const user = await this.usersService.findUserByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found.');

    // mail user
    const code = randomize('0', 4);

    const token = await this.jwtService.signAsync(
      { code, email: user.email },
      {
        expiresIn: TIME_IN.minutes[15],
      },
    );

    await this.cache.set(
      RP_TOKEN(user._id.toString()),
      token,
      TIME_IN.minutes[15],
    );

    console.log(RP_TOKEN, await this.cache.get(RP_TOKEN(user._id.toString())));

    return token;
  };

  resendPRCode = async (jwt: string) => {
    const decoded = await this.jwtService.verifyAsync<{
      code: string;
      email: string;
    }>(jwt);

    return this.forgotPassword({ email: decoded.email });
  };
}

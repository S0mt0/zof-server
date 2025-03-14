import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { Model } from 'mongoose';

import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto';
import { CacheService } from 'src/lib/cache/cache.service';
import {
  JWT_REFRESH_TOKEN_EXP,
  SESSION_USER,
  TIME_IN,
} from 'src/lib/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cache: CacheService,
    private configService: ConfigService,
  ) {}

  create(dto: any) {
    return this.userModel.create(dto);
  }

  findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  findUserById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findUserById(id);
    if (!user) throw new NotFoundException('User not found');

    if (dto.new_password && !dto.old_password)
      throw new BadRequestException('Current password is required🚫');

    if (dto.new_password && !dto.confirm_password)
      throw new BadRequestException('Please confirm your new password');

    if (dto.new_password && dto.new_password !== dto.confirm_password)
      throw new BadRequestException('Passwords do not match!');

    if (dto.new_password) {
      const oldPwdIsCorrect = await user.verifyPassword(dto.old_password);
      if (!oldPwdIsCorrect)
        throw new BadRequestException('Current password incorrect.');

      const hashed = await argon2.hash(dto.new_password);
      user.password = hashed;
    }

    if (dto.email) {
      user.email = dto.email;
    }

    if (dto.avatarUrl) {
      user.avatarUrl = dto.avatarUrl;
    }

    if (dto.username) {
      user.username = dto.username;
    }

    await user.save();

    await this.cache.set(
      SESSION_USER(user._id.toString()),
      user.toJSON(),
      this.configService.get(JWT_REFRESH_TOKEN_EXP, TIME_IN.days[7].toString()),
    );

    return user;
  }

  async delete(id: string) {
    const user = await this.userModel.findOneAndDelete({ _id: id }).exec();

    if (user) await this.cache.delete(SESSION_USER(user._id.toString()));

    return 'Account deleted';
  }
}

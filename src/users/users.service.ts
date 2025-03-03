import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './database/schemas/user.schema';
import { CreateUserDto } from './dto';
import { IUserModel, UserDocument } from './database/interface';
import { emailVerificationTemplate } from '../lib/email/template';
import { obscureEmail } from '../lib';
import { UserAuthRes } from './types';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mailer/mailer.service';
import { Model } from 'mongoose';
import { accounts } from 'src/lib/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: IUserModel,

    private readonly mailService: MailService,
  ) {}
  // async findOne(): Promise<User | undefined> {
  //   return;
  // }
  public async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findByEmail(email);
  }

  public async createUser(
    createUserDto: CreateUserDto,
  ): Promise<UserAuthRes & { token: string }> {
    switch (createUserDto.account_type) {
      case accounts.User:
      case accounts.ADMIN:
        const userExist = await this.userModel.findByEmail(createUserDto.email);
        if (userExist) throw new BadRequestException('Email already exists');

        const user = await this.userModel.create(createUserDto);

        const userData = user.createEmailVerificationToken();

        const mailOptions = emailVerificationTemplate(
          user.fullName,
          userData.code,
        );

        await this.mailService.viaNodemailer({
          ...mailOptions,
          to: user.email,
        });

        return {
          success: true,
          token: userData.token,
          message: `Registration successful. Verify your email with the code that was sent to ${obscureEmail(user.email)}`,
        };
      default:
        throw new BadRequestException('Provided account type is not supported');
    }
  }

  // const newUser = new this.userModel(userDto);
  // return newUser.save();

  // findAll() {
  //   return this.userModel.findAll();
  // }

  public async deleteByEmail(email: string) {
    const user = await this.userModel.findByEmail(email);
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    return await this.userModel.deleteOne({ email }).exec();
  }
}

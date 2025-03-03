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

  /** Updates user password
   * @returns Company account Document
   */
  public resetPassword = async (data: any) => {
    const foundAccount = await this.userModel.findById(data.userId);

    if (!foundAccount)
      throw new NotFoundException(
        'Sorry, we could not find this user in our database',
      );

    foundAccount.password = data.new_password;
    await foundAccount.save();

    return foundAccount;
  };

  /** Verifies code for request to reset forgotten password
   * @returns access token
   */
  public async verifyPasswordResetCode(data: any) {
    const foundUser = await this.findByEmail(data.email);

    if (data.password_reset_code.toString() !== data.code.toString())
      throw new BadRequestException(
        'Oops! That code was not a match, try again.',
      );

    if (Date.now() > data.expiresAt)
      throw new BadRequestException('Sorry, that code expired. Try again.');

    return foundUser.createAccessToken();
  }

  public async authenticateEmail(data: any) {
    const user = await this.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid verification data');
    }

    if (data.code.toString() !== data?.verificationCode.toString()) {
      throw new BadRequestException('Invalid verification code');
    }

    // Mark email as verified (assuming verified_email field exists)
    user.verified_email = true;
    return user.save();
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

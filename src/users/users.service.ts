import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './schema/user.schema';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(dto: CreateUserDto) {
    return this.userModel.create(dto);
  }

  findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  findUserById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, dto: Partial<User>): Promise<User> {
    const user = await this.userModel
      .findOneAndUpdate({ _id: id }, dto, { runValidators: true, new: true })
      .exec();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async delete(id: string) {
    await this.userModel.findOneAndDelete({ _id: id }).exec();
    return 'Account deleted';
  }

  async verifyUserPassword(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) return false;

    return user.verifyPassword(password);
  }
}

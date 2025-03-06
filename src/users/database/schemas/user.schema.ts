import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { isEmail } from 'class-validator';

import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../interface/index';
import {
  PROFILE_IMGS_COLLECTIONS_LIST,
  PROFILE_IMGS_NAME_LIST,
  TIME_IN,
} from 'src/lib/constants';
import { getRandomNumbers } from 'src/lib/utils';
import { ConfigService } from '@nestjs/config';
import { AccountType } from '../../../lib';

const jwtService = new JwtService();
const configService = new ConfigService();

@Schema({
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.terms_of_service;
      delete ret.refresh_token;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.terms_of_service;
      delete ret.refresh_token;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.__v;
      return ret;
    },
  },
  timestamps: true,
})
export class User implements IUser {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Blog' }] }) // Relation with Blogs
  blogs: Types.ObjectId[];

  @Prop({ required: [true, 'First name is required'] })
  first_name: string;

  @Prop({ required: [true, 'Last name is required'] })
  last_name: string;

  @Prop({
    required: [true, 'Email address is required'],
    trim: true,
    unique: true,
    validate: [isEmail, '`{VALUE}` is not a valid email!'],
  })
  email: string;

  @Prop()
  phone: string;

  @Prop({
    default: () =>
      `https://api.dicebear.com/6.x/${PROFILE_IMGS_COLLECTIONS_LIST[Math.floor(Math.random() * PROFILE_IMGS_COLLECTIONS_LIST?.length)]}/svg?seed=${PROFILE_IMGS_NAME_LIST[Math.floor(Math.random() * PROFILE_IMGS_NAME_LIST?.length)]}`,
  })
  avatarUrl: string;

  @Prop({ default: false })
  verified_email: boolean;

  @Prop({
    required: [true, 'Password is required'],
  })
  password: string;

  @Prop({
    type: [String],
    default: ['user'],
    enum: ['user', 'admin'],
  })
  roles: string[];

  @Prop()
  address: string;

  fullName: string;

  @Prop({ type: String, required: true, enum: ['admin', 'user'] })
  account_type: AccountType;

  @Prop({ type: String, enum: ['male', 'female'] })
  gender: 'male' | 'female';

  @Prop({ default: false })
  terms_of_service: boolean;

  @Prop({ trim: true, minlength: 5, maxlength: 400 })
  bio: string;

  @Prop()
  refresh_token: string;

  /** Verifies the provided password by comparing it with the password of the user. */
  verifyPassword: (candidatePassword: string) => Promise<boolean>;

  /** Creates and returns a `jwt` access token encoded with the `userId`, `roles` and `account_type` property */
  createAccessToken: (expiresAt?: number | string | undefined) => string;

  /** Creates and returns a `jwt` token encoded with the `email`, `code`, `token` `account_type`, and `expiresAt` properties that will be sent when there's a request to reset a forgotten password.
   * @param maxLength The maximum length of the code generated. Defaults to 4
   * @param expiresAt The lifespan of the code generated. Defaults to  15. Example: 1 = 1 minute, 15 = 15 minutes
   */
  createResetPasswordToken: (
    maxLength?: number,
    expiresAt?: number,
  ) => {
    code: number;
    expiresAt: number;
    token: string;
    email: string;
    account_type: AccountType;
  };

  /** Creates and returns a `jwt` token encoded with the `email`, `code`, `token`, and `account_type` properties which is required to be sent along when there's a request to verify a admin's email
   * @param expiresAt The lifespan of the code generated. Defaults to  15. Example: 1 = 1 minute, 15 = 15 minutes
   */
  createEmailVerificationToken: (
    maxLength?: number,
    expiresAt?: number,
  ) => {
    code: number;
    token: string;
    email: string;
    account_type: AccountType;
  };
}

// Define document type
export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual: fullName
UserSchema.virtual('fullName').get(function (this: HydratedDocument<IUser>) {
  return `${this.first_name} ${this.last_name}`;
});

// Pre-save middleware: Hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await argon.hash(this.password);
  next();
});

// Instance Methods
UserSchema.methods = {
  async verifyPassword(
    this: UserDocument,
    candidatePassword: string,
  ): Promise<boolean> {
    return argon.verify(this.password, candidatePassword);
  },

  createAccessToken(this: UserDocument, expiresAt?: number | string): string {
    return jwtService.sign(
      { sub: this._id, roles: this.roles, account_type: this.account_type },
      {
        secret: configService.get('JWT_SECRET'),
        expiresIn: expiresAt || TIME_IN.days[3],
      },
    );
  },

  createResetPasswordToken(
    this: UserDocument,
    length?: number,
    expiresAt?: number,
  ): any {
    const { code } = getRandomNumbers(length);

    const data = {
      code,
      email: this.email,
      account_type: this.account_type,
    };
    const token = jwtService.sign(data, {
      secret: configService.get('JWT_SECRET'),
      expiresIn: `${expiresAt || TIME_IN.minutes[15]}`,
    });

    return {
      ...data,
      token,
    };
  },

  createEmailVerificationToken(
    this: UserDocument,
    length?: number,
    expiresAt?: number,
  ): any {
    const { code } = getRandomNumbers(length);

    const data = {
      code,
      email: this.email,
      account_type: this.account_type,
    };
    const token = jwtService.sign(data, {
      secret: configService.get('JWT_SECRET'),
      expiresIn: `${expiresAt || TIME_IN.hours[1]}`,
    });
    return { ...data, token };
  },
};

// Static Method
UserSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email }).exec();
};

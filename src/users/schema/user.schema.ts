import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as argon2 from 'argon2';
import { isEmail } from 'class-validator';
import randomize from 'randomatic';

import { getRandomAvatarUrl, transformSchema } from 'src/lib/utils';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: transformSchema(['refresh_token', 'password', 'socialId']),
})
export class User {
  @Prop({
    default: function () {
      return makeUsernameFromEmail(this.email);
    },
  })
  username: string;

  @Prop({
    unique: true,
    sparse: true,
    validate: [isEmail, '`{VALUE}` is not a valid email!'],
  })
  email: string;

  @Prop({ default: false })
  google_auth: boolean;

  @Prop({
    required: function () {
      return !this.google_auth;
    },
  })
  password: string;

  @Prop({
    default: getRandomAvatarUrl(),
  })
  avatarUrl: string;

  @Prop()
  socialId: string;

  @Prop()
  refresh_token: string;

  async verifyPassword(password: string): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await argon2.hash(this.password);
  }

  next();
});

UserSchema.methods.verifyPassword = async function (password: string) {
  return await argon2.verify(this.password, password);
};

const makeUsernameFromEmail = (email: string) =>
  `${email.split('@')[0]}${randomize('0', 4)}`;

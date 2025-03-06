import { Document, HydratedDocument, Model, ObjectId, Types } from 'mongoose';
import { AccountType } from '../../../lib';
import { UserDocument } from '../schemas/user.schema';

export interface IUser {
  /** Google userId */
  // googleId: string;

  /** user blog Id */
  blogs: Types.ObjectId[];

  /** User's first name */
  first_name: string;

  /** User's last name */
  last_name: string;

  /** Url to avatar of user */
  avatarUrl: string;

  /** user address */
  address: string;

  /** User's email */
  email: string;

  /** Account type */
  account_type: AccountType;

  /** Email verification status. If email is not verified, their accounts cannot be accessed */
  verified_email: boolean;

  /** User's phone numbers */
  phone: string;

  /** fullName virtual */
  fullName: string;

  /** Gender */
  gender: 'male' | 'female';

  /** User's login password */
  password: string;

  /** Roles */
  roles: string[];

  /** About user */
  bio: string;

  /** Refresh token - for admins */
  refresh_token: string;

  /** Status checking terms and conditions of service */
  terms_of_service: boolean;
}

/** Interface describing the `User` model
 * @description Defines custom `static` methods on `User` model
 */
export interface UserModel extends Model<UserDocument> {
  findByEmail(email: string): Promise<UserDocument | null>;
}

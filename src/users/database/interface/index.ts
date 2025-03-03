import { Document, HydratedDocument, Model } from 'mongoose';
import { AccountType } from '../../../lib';

export interface IUser {
  /** Google userId */
  // googleId: string;

  /** User's first name */
  first_name: string;

  /** User's last name */
  last_name: string;

  /** Url to avatar of user */
  avatarUrl: string;

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

/** Interface describing custom methods associated with the `User` model */
export interface IUserMethods {
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

/** Interface describing the `User` model
 * @description Defines custom `static` methods on `User` model
 */
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findByEmail(email: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

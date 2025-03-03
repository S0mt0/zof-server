import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { AccountType } from '../../lib';

export class LoginUserDto {
  @IsString()
  account_type: AccountType;

  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsStrongPassword({ minLength: 6 })
  password?: string;
}

import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class NewPasswordDto {
  @IsString()
  confirm_password: string;

  @IsStrongPassword({ minLength: 6 }, { message: 'Password not strong enough' })
  new_password: string;
}

export class ResetPasswordDTO {
  @IsString()
  rp_code: string;
}

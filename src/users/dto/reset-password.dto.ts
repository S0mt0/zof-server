import { IsString, IsStrongPassword, IsOptional } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsOptional()
  new_password: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword({ minLength: 6 }, { message: 'Password not strong enough' })
  confirm_password: string;
}

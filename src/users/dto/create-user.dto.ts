import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  google_auth?: boolean;

  @IsOptional()
  @IsString()
  @IsStrongPassword({ minLength: 6 }, { message: 'Password not strong enough' })
  password?: string;

  @IsString()
  confirm_password?: string;
}

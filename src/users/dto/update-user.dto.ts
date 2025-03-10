import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  username?: string;

  @IsString()
  @IsOptional()
  old_password?: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword({ minLength: 6 }, { message: 'Password not strong enough' })
  new_password?: string;
}

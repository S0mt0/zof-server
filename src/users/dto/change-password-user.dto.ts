import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  old_password: string;

  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  @MaxLength(32, { message: 'New password must not exceed 32 characters' })
  new_password: string;
}

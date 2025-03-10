import { IsString, IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({ minLength: 6 }, { message: 'Password not strong enough' })
  password: string;
}

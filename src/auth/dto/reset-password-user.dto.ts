import { IsString, Length } from 'class-validator';

export class ResetPasswordUserDTO {
  @IsString()
  @Length(4)
  password_reset_code: string;
}

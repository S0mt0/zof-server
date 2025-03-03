import { IsString, Length } from 'class-validator';

export class VerifyEmailCodeDTO {
  @IsString()
  @Length(4)
  verification_code: string;
}

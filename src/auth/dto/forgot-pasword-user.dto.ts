import { OmitType } from '@nestjs/mapped-types';
import { LoginUserDto } from './login-user.dto';

export class ForgotPasswordUserDto extends OmitType(LoginUserDto, [
  'password',
] as const) {}

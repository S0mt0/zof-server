import { OmitType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'terms_of_service',
  'email',
] as const) {}

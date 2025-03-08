import { SetMetadata } from '@nestjs/common';

export const MESSAGE = 'message';

export const Message = (message: string = 'Success') =>
  SetMetadata('message', message);

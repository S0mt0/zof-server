import { SetMetadata } from '@nestjs/common';

export const MESSAGE_KEY = 'message';

export const Message = (message: string = 'Success') =>
  SetMetadata(MESSAGE_KEY, message);

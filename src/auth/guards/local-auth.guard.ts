import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGY } from '../constants';

@Injectable()
export class LocalAuthGuard extends AuthGuard(STRATEGY.local) {}

// export const LocalAuthGuard = () => UseGuards(LocalAuthenticationGuard);

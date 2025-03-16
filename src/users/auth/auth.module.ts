import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  JWT_ACCESS_TOKEN_EXP,
  JWT_ACCESS_TOKEN_SECRET,
} from 'src/lib/constants';
import { UsersModule } from '../users.module';
// import { FirebaseAdminService } from './firebase-admin.service';

@Module({
  imports: [
    UsersModule,

    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(JWT_ACCESS_TOKEN_SECRET),
        signOptions: {
          expiresIn: configService.get(JWT_ACCESS_TOKEN_EXP, '15m'),
        },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    //FirebaseAdminService
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

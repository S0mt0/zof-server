import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {
  JWT_ACCESS_TOKEN_EXP,
  JWT_ACCESS_TOKEN_SECRET,
} from 'src/lib/constants';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_ACCESS_TOKEN_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(JWT_ACCESS_TOKEN_EXP),
        },
      }),

      inject: [ConfigService],
    }),
  ],

  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}

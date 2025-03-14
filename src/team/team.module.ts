import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { Team, TeamSchema } from './schema/team.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/users/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [MongooseModule],
})
export class TeamModule {}

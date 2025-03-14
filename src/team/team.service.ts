import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Team } from './schema/team.schema';
import { Model } from 'mongoose';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) private teamModel: Model<Team>) {}

  create(dto: CreateTeamDto) {
    return this.teamModel.create(dto);
  }

  findAll() {
    return this.teamModel.find();
  }

  findById(id: string) {
    return this.teamModel.findById(id);
  }

  update(id: string, dto: UpdateTeamDto) {
    return this.teamModel.findOneAndUpdate({ _id: id }, dto, {
      runValidators: true,
      new: true,
    });
  }

  async remove(id: string) {
    await this.teamModel.findOneAndDelete({ _id: id });

    return 'Team member removed';
  }
}

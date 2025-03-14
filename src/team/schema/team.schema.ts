import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ITeam } from './team.type';

export type TeamDocument = HydratedDocument<Team>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Team implements ITeam {
  @Prop({ type: String, required: true, minlength: 3 })
  name: string;

  @Prop({ type: String })
  avatarUrl: string;

  @Prop({ type: String, required: true, default: 'member' })
  role: string;

  @Prop({ type: String })
  bio: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.index({ name: 1, role: 1 }, { unique: true });

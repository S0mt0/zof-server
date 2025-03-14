import { IsOptional, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

import {
  IsString,
  IsOptional,
  IsEnum,
  IsMimeType,
  IsNumber,
  Max,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class AvatarDto {
  @IsOptional()
  @IsString()
  fieldname?: string;

  @IsOptional()
  @IsString()
  originalname?: string;

  @IsOptional()
  @IsString()
  encoding?: string;

  @IsOptional()
  @IsMimeType()
  mimetype?: string;

  @IsOptional()
  @IsNumber()
  @Max(5000000) // Max 5MB
  size?: number;

  @IsOptional()
  @Transform(({ value }) => Buffer.from(value))
  buffer?: Buffer;
}

export class UpdateProfileDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => AvatarDto)
  avatarUrl?: AvatarDto;

  @IsOptional()
  @IsEnum(['male', 'female'], {
    message: 'Gender must be male, female',
  })
  gender?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;
}

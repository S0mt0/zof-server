import { Transform } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsIn,
} from 'class-validator';

export class ParseEventQueryDto {
  @IsString()
  @IsOptional()
  @IsIn([
    'createdAt',
    '-createdAt',
    'updatedAt',
    '-updatedAt',
    'scheduledFor',
    '-scheduledFor',
  ])
  @Transform(({ value }) => (value !== undefined ? value : '-createdAt'))
  sort?: string = '-createdAt';

  @IsString()
  @IsOptional()
  fields?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? value === 'true' : false))
  draft?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  featured?: boolean;

  @IsInt()
  @Min(1, { message: 'Page must be at least 1' })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  page: number = 1;

  @IsInt()
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(10, { message: 'Limit cannot exceed 10' })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  limit: number = 10;
}

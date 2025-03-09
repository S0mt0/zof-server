import { Transform } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsIn,
  IsDate,
  IsDateString,
} from 'class-validator';

export class ParseEventQueryDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  eventId?: string;

  @IsString()
  @IsOptional()
  @IsIn(['createdAt', '-createdAt', 'updatedAt', '-updatedAt']) // Since the only sortable properties of blog is the creation and update time, it only makes sense to restrict the sort parameters to these properties.
  @Transform(({ value }) => (value !== undefined ? value : '-createdAt'))
  sort?: string = '-createdAt';

  @IsString()
  @IsOptional()
  fields?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? value === 'true' : false))
  draft?: boolean;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDateString()
  @IsOptional()
  timestamp?: Date;

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

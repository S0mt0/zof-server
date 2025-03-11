import {
  IsString,
  IsBoolean,
  MinLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  IsOptional,
  MaxLength,
  IsDate,
  IsMongoId,
  IsDateString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateEventDto {
  @IsString({ message: 'Event title is required.' })
  @MinLength(5)
  title: string;

  @IsString({ message: 'Event description is required.' })
  @MinLength(10)
  @MaxLength(200)
  desc: string;

  @IsString({ message: 'Please provide a cover image.' })
  banner: string;

  @IsBoolean()
  @IsOptional()
  featured: boolean;

  @IsBoolean()
  @IsOptional()
  draft: boolean;

  @IsString({ message: 'Please provide a location.' })
  location: string;

  @IsDateString()
  timestamp: Date;

  @IsOptional()
  @IsMongoId()
  publishedBy?: Types.ObjectId;

  @IsString({ message: 'Please provide a more details.' })
  @IsOptional()
  more_details: string;
}

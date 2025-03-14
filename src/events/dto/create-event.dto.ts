import {
  IsString,
  IsBoolean,
  MinLength,
  IsOptional,
  MaxLength,
  IsDateString,
} from 'class-validator';

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
  scheduledFor: Date;

  @IsString({ message: 'Please provide more details about the event.' })
  more_details: string;
}

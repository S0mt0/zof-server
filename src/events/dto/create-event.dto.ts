import {
  IsString,
  IsBoolean,
  MinLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  IsOptional,
  MaxLength,
  IsDateString,
} from 'class-validator';

import { EventContent } from '../schema/event.type';

@ValidatorConstraint({ name: 'IsEventContent', async: false })
export class IsEventContentConstraint implements ValidatorConstraintInterface {
  validate(value: EventContent) {
    if (!value) return false;

    if (typeof value !== 'object') return false;

    if (!Object.keys(value).length) return false;

    if (!Object.keys(value).includes('blocks')) return false;

    if (!Array.isArray(value.blocks)) return false;

    if (!value.blocks.length) return false;

    const hasEmptyBlocks = Boolean(
      value.blocks.filter((block) => !Object.keys(block).length).length,
    );

    return !hasEmptyBlocks;
  }

  defaultMessage(): string {
    return 'Event content is required.';
  }
}

export class CreateEventDto {
  @IsString({ message: 'Event title is required.' })
  @MinLength(5)
  title: string;

  @IsString({ message: 'Event description is required.' })
  @MinLength(10)
  @MaxLength(200)
  desc: string;

  @IsString({ message: 'Please provide a cover image.' })
  bannerUrl: string;

  @IsBoolean()
  @IsOptional()
  featured: boolean;

  @IsBoolean()
  @IsOptional()
  draft: boolean;

  @IsDateString()
  scheduledFor: Date;

  @Validate(IsEventContentConstraint)
  content: EventContent;
}

import {
  IsString,
  IsBoolean,
  MinLength,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { BlogContent } from '../schema/blog.type';

@ValidatorConstraint({ name: 'IsBlogContent', async: false })
export class IsBlogContentConstraint implements ValidatorConstraintInterface {
  validate(value: BlogContent) {
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
    return 'Blog content is required.';
  }
}

export class CreateBlogDto {
  @IsString({ message: 'Blog title is required.' })
  @MinLength(5)
  title: string;

  @IsString({ message: 'Blog description is required.' })
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

  @Validate(IsBlogContentConstraint)
  content: BlogContent;
}

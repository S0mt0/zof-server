import {
  IsArray,
  IsInt,
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export type BlockType = 'paragraph' | 'header' | 'list' | 'image' | 'attaches';

export class FileDataDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsInt()
  size?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  extension?: string;
}

export class BlockDataDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsInt()
  level?: number;

  @IsOptional()
  @IsString()
  type?: 'unordered' | 'ordered';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  items?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => FileDataDto)
  file?: FileDataDto;

  @IsOptional()
  @IsObject()
  tunes?: Record<string, any>;

  @IsOptional()
  withBorder?: boolean;

  @IsOptional()
  withBackground?: boolean;

  @IsOptional()
  stretched?: boolean;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  title?: string;
}

export class BlockDto {
  @IsString()
  id: string;

  @IsString()
  type: BlockType;

  @ValidateNested()
  @Type(() => BlockDataDto)
  data: BlockDataDto;
}

export class CreateBlogDto {
  @IsInt()
  time: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockDto)
  blocks: BlockDto[];

  // @IsMongoId()
  // user: Types.ObjectId; // Relating the blog to a user
}

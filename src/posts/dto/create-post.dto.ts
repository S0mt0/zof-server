import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(5, 100)
  title: string;

  @IsString()
  @Length(10, 5000)
  content: string;

  @IsUUID()
  userId: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

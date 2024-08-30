import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";

export class CreateBookDto {
  @IsNotEmpty({ message: 'ISBN is required' })
  @IsString({ message: 'ISBN must be a string' })
  isbn: string;
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;
  @IsOptional({ message: 'Subtitle is optional' })
  @IsString({ message: 'Subtitle must be a string' })
  subtitle?: string;
  @IsOptional({ message: 'Summary is optional' })
  @IsString({ message: 'Summary must be a string' })
  summary?: string;
  @IsOptional({ message: 'Cover image is optional' })
  @IsUrl({}, { message: 'Cover image must be a URL' })
  cover_image?: string;
  @IsOptional({ message: 'Published date is optional' })
  @IsNotEmpty({ message: 'Published date is required' })
  @IsDate({ message: 'Published date must be a date' })
  published_date?: Date;
  @IsOptional({ message: 'Authors is optional' })
  @IsArray({ message: 'Author must be an array' })
  @IsUUID(undefined,{each: true, message: 'Author must be a valid UUID'})
  author?: string[];
  @IsOptional({ message: 'Genres is optional' })
  @IsArray({ message: 'Genre must be an array' })
  @IsUUID(undefined,{each: true, message: 'Genre must be a valid UUID'})
  genre?: string[];
  @IsUUID(undefined,{ message: 'Publisher must be a valid UUID' })
  @IsNotEmpty({ message: 'Publisher is required' })
  publisher: string;
  @IsNotEmpty({ message: 'Page count is required' })
  @IsNumber({}, { message: 'Page count must be a number' })
  page_count: number;
  @IsOptional({ message: 'Preview link is optional' })
  @IsUrl({}, { message: 'Preview link must be a URL' })
  preview_link?: string;
  @IsOptional({ message: 'Info link is optional' })
  @IsUrl({}, { message: 'Info link must be a URL' })
  info_link?: string;
}
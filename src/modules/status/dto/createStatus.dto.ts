import { IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";

export class CreateStatusDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name: string;
  @IsNotEmpty({ message: 'List is required' })
  @IsUUID(undefined, { message: 'List must be a valid UUID' })
  list: string;
}
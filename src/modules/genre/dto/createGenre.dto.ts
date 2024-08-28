import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenreDto {
  @IsNotEmpty({message: "Genre name is required."})
  @IsString({message: "Genre name must be a string."})
  name: string;
}

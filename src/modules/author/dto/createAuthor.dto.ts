import { IsNotEmpty, IsString } from "class-validator";

export class CreateAuthorDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;
  @IsNotEmpty({ message: 'Surname is required' })
  @IsString({ message: 'Surname must be a string' })
  surname: string;
}
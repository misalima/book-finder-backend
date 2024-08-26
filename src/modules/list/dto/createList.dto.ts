import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateListDto{
    @IsNotEmpty({ message: 'List name is required' })
    @IsString({ message: 'List name must be a string' })
    @MinLength(4, { message: 'List name must be at least 4 characters' })
    name: string;
}
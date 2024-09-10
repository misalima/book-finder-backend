import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateListDto{
    @IsNotEmpty({ message: 'List name is required' })
    @IsString({ message: 'List name must be a string' })
    @MinLength(4, { message: 'List name must be at least 4 characters' })
    name: string;
    @IsOptional({message: 'List visibility is optional'})
    @IsNumber({}, {message: 'List visibility must be a number'})
    @IsIn([0, 1], {message: 'List visibility must be 0 (public) or 1 (private)'})
    list_visibility?: number;
}
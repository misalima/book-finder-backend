import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignInDto {
    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    @MinLength(4, { message: 'Username must be at least 4 characters long' })
    username: string;
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}
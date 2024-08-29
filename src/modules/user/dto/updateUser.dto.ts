import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./createUser.dto";
import { IsIn, IsNumber, IsOptional } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional({message: 'Profile visibility is optional'})
  @IsNumber({}, {message: 'Profile visibility must be a number'})
  @IsIn([0, 1], {message: 'Profile visibility must be 0 (public) or 1 (private)'})
  profile_visibility?: number;
}
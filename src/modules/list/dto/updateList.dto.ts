import { CreateListDto } from "./createList.dto";
import { PartialType } from "@nestjs/mapped-types";
import { IsIn, IsNumber, IsOptional } from "class-validator";

export class UpdateListDto extends PartialType(CreateListDto) {
  @IsOptional({message: 'List visibility is optional'})
  @IsNumber({}, {message: 'List visibility must be a number'})
  @IsIn([0, 1], {message: 'List visibility must be 0 (public) or 1 (private)'})
  list_visibility?: number;
}
import { CreateListDto } from "./createList.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateListDto extends PartialType(CreateListDto) {
}
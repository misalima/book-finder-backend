import { PartialType } from "@nestjs/mapped-types";
import { CreateStatusDto } from "./createStatus.dto";

export class UpdateStatusDto extends PartialType(CreateStatusDto) {
}
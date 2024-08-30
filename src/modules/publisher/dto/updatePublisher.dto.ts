import { PartialType } from "@nestjs/mapped-types";
import { CreatePublisherDto } from "./createPublisher.dto";

export class UpdatePublisherDto extends PartialType(CreatePublisherDto) {
}
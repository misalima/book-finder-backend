import { IsNotEmpty, IsUUID } from "class-validator";

export class AddBookToListDto {
  @IsNotEmpty({ message: 'Status id is required' })
  @IsUUID(undefined, { message: 'Invalid status id' })
  statusId: string;
}
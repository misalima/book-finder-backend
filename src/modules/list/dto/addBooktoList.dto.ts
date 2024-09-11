import { IsNotEmpty, IsUUID } from "class-validator";

export class AddBookToListDto {
  @IsNotEmpty({ message: 'Book id is required' })
  @IsUUID(undefined, { message: 'Invalid book id' })
  bookId: string;
  @IsNotEmpty({ message: 'Status id is required' })
  @IsUUID(undefined, { message: 'Invalid status id' })
  statusId: string;
}
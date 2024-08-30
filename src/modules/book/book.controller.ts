import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { BookService } from "./book.service";
import { JwtAuthGuard } from "../auth/auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('app/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    return this.bookService.getBookById(id);
  }

  @Get('search/:title')
  async getBookByTitle(@Param('title') title: string) {
    return this.bookService.getBooksByTitle(title);
  }
}
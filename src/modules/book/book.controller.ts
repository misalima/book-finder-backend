import { Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { BookService } from "./book.service";
import { JwtAuthGuard } from "../auth/auth.guard";
import { Request } from "express";

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

  @Get('search/title/:title')
  async getBookByTitle(@Param('title') title: string) {
    return this.bookService.getBooksByTitle(title);
  }

  @Get('search/isbn/:isbn')
  async getBookByIsbn(@Param('isbn') isbn: string) {
    return this.bookService.getBookByIsbn(isbn);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list/:listId')
  async getBooksByList(@Param('listId') listId: string, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.bookService.getBooksByList(listId, requestedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":bookId/:listId")
  async addBookToList(@Param('bookId') bookId: string, @Param('listId') listId: string, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.bookService.addBookToList(bookId, listId, requestedUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":bookId/:listId")
  async removeBookFromList(@Param('listId') listId: string, @Param('bookId') bookId: string, @Req() req: Request) {
    const requestedUserId = req.user['userId'];
    return this.bookService.removeBookFromList(listId, bookId, requestedUserId);
  }
}
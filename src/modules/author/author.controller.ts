import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthorService } from "./author.service";
import { JwtAuthGuard } from "../auth/auth.guard";

@UseGuards(JwtAuthGuard)
@Controller("app/author")
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  async getAllAuthors() {
    return this.authorService.getAllAuthors();
  }

  @Get(':id')
  async getAuthorById(id: string) {
    return this.authorService.getAuthorById(id);
  }

  @Get('name/:name')
  async getAuthorByName(name: string) {
    return this.authorService.getAuthorByName(name);
  }
}
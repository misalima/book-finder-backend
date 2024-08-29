import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";
import { HttpModule } from "@nestjs/axios";
import { ExternalBookService } from "./externalBook.service";
import { GenreModule } from "../genre/genre.module";
import { AuthorModule } from "../author/author.module";
import { PublisherModule } from "../publisher/publisher.module";

@Module({
  imports: [HttpModule, GenreModule, AuthorModule, PublisherModule],
  controllers: [BookController],
  providers: [PrismaService, ExternalBookService, BookService]
})

export class BookModule {}
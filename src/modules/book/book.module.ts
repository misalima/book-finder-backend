import { forwardRef, Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";
import { HttpModule } from "@nestjs/axios";
import { ExternalBookService } from "./externalBook.service";
import { GenreModule } from "../genre/genre.module";
import { AuthorModule } from "../author/author.module";
import { PublisherModule } from "../publisher/publisher.module";
import { ListModule } from "../list/list.module";

@Module({
  imports: [HttpModule, GenreModule, AuthorModule, PublisherModule, forwardRef(() => ListModule)],
  controllers: [BookController],
  providers: [PrismaService, ExternalBookService, BookService],
  exports: [BookService],
})

export class BookModule {}
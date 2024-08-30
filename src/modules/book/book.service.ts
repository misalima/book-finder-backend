import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CreateBookDto } from "./dto/createBook.dto";
import { ExternalBookService } from "./externalBook.service";
import { UpdateBookDto } from "./dto/updateBook.dto";
import { ExistsBookException } from "./exception/existsBook.exception";

@Injectable()
export class BookService {
  constructor(private readonly prismaService: PrismaService, private readonly externalBookService: ExternalBookService) {}

  async getAllBooks() {
    return this.prismaService.book.findMany();
  }

  async getBookById(id: string) {
    const book = await this.prismaService.book.findUnique({
      where: { id }
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }else{
      return book;
    }
  }

  async getBooksByTitle(title: string) {
    const books = await this.prismaService.book.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
    });

    if (books.length === 0) {
      const externalBook = await this.externalBookService.findBookInExternalApi(title);
      if (externalBook) {
        externalBook.map(book => {
          this.createBook(book)
        })
        return externalBook;
      }else{
        throw new ExistsBookException('Book not found');
      }
    }else{
      return books;
    }
  }

  async createBook(data: CreateBookDto) {
    return this.prismaService.book.create({
      data: {
        isbn: data.isbn,
        title: data.title,
        subtitle: data.subtitle,
        summary: data.summary,
        cover_image: data.cover_image,
        published_date: data.published_date,
        page_count: data.page_count,
        preview_link: data.preview_link,
        info_link: data.info_link,
        authors: {
          connect: data.author.map((authorId: string) => ({ id: authorId }))
        },
        genres: {
          connect: data.genre.map((genreId: string) => ({ id: genreId }))
        },
        publisher: {
          connect: { id: data.publisher }
        }
      }
    });
  }

  async updateBook(id: string, data: UpdateBookDto) {
    return this.prismaService.book.update({
      where: { id },
      data: {
        isbn: data.isbn,
        title: data.title,
        subtitle: data.subtitle,
        summary: data.summary,
        cover_image: data.cover_image,
        published_date: data.published_date,
        page_count: data.page_count,
        preview_link: data.preview_link,
        info_link: data.info_link,
        authors: {
          set: data.author.map((authorId: string) => ({ id: authorId }))
        },
        genres: {
          set: data.genre.map((genreId: string) => ({ id: genreId }))
        },
        publisher: {
          connect: { id: data.publisher }
        }
      }
    });
  }
}
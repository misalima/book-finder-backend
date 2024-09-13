import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CreateBookDto } from "./dto/createBook.dto";
import { ExternalBookService } from "./externalBook.service";
import { ExistsBookException } from "./exception/existsBook.exception";
import { ListService } from "../list/list.service";
import { AddBookToListDto } from "./dto/addBooktoList.dto";
import { ExistsStatusException } from "../status/exception/existsStatus.exception";
import { AuthorizationService } from "../authorization/authorization.service";
import { StatusService } from "../status/status.service";

@Injectable()
export class BookService {
  constructor(private readonly prismaService: PrismaService,
              private readonly externalBookService: ExternalBookService,
              private readonly  listService: ListService,
              private readonly authorizationService: AuthorizationService,
              private readonly statusService: StatusService) {}

  async getAllBooks() {
    return this.prismaService.book.findMany();
  }

  async getBookById(id: string) {
    const book = await this.prismaService.book.findUnique({
      where: { id },
      select: {
        id: true,
        isbn: true,
        title: true,
        subtitle: true,
        summary: true,
        cover_image: true,
        published_date: true,
        page_count: true,
        preview_link: true,
        info_link: true,
        authors: true,
        genres: true,
        publisher: true
      }
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }else{
      return book;
    }
  }

  async getBookByIsbn(isbn: string) {
    return this.prismaService.book.findUnique({
      where: { isbn },
      select: {
        id: true,
        isbn: true,
        title: true,
        subtitle: true,
        summary: true,
        cover_image: true,
        published_date: true,
        page_count: true,
        preview_link: true,
        info_link: true,
        authors: true,
        genres: true,
        publisher: true
      }
    });
  }

  async getBooksByTitle(title: string) {
    const books = await this.prismaService.book.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        isbn: true,
        title: true,
        subtitle: true,
        summary: true,
        cover_image: true,
        published_date: true,
        page_count: true,
        preview_link: true,
        info_link: true,
        authors: true,
        genres: true,
        publisher: true
      }
    });

    const externalBooks = await this.externalBookService.findBookInExternalApi(title);

    if (externalBooks){
      for (const book of externalBooks) {
        const existingBook = await this.getBookByIsbn(book.isbn);

        if (!existingBook) {
          const newBook = await this.createBook(book);
          books.push(newBook);
        }
      }
    }else{
      throw new ExistsBookException('Book not found');
    }

    return books;
  }

  async getBooksByList(listId: string, requestedUserId: string) {
    const list = await this.listService.getListById(listId, requestedUserId);
    const books = await this.prismaService.bookListStatus.findMany({
      where: {
        listId: list.id
      }
    });

    if (!books) {
      throw new ExistsBookException('Books not found in this list');
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
      },
      select: {
        id: true,
        isbn: true,
        title: true,
        subtitle: true,
        summary: true,
        cover_image: true,
        published_date: true,
        page_count: true,
        preview_link: true,
        info_link: true,
        authors: true,
        genres: true,
        publisher: true
      }
    });
  }

  async addBookToList(bookId: string, listId: string, requestedUserId: string, data: AddBookToListDto) {
    await this.getBookById(bookId);
    const list = await this.listService.getListById(listId, requestedUserId);
    await this.authorizationService.checkUserPermission(list.userId, requestedUserId);
    const statuses = await this.statusService.getStatusByList(list.id, requestedUserId);
    const statusExists = statuses.some(status => status.id === data.statusId);

    if (!statusExists) {
      throw new ExistsStatusException('Status does not exist in this list');
    }else{
      return this.prismaService.bookListStatus.create({
        data:{
          bookId: bookId,
          listId: listId,
          statusId: data.statusId
        }
      });
    }
  }

  async removeBookFromList(listId: string, requestedUserId: string, bookId: string) {
    const list = await this.listService.getListById(listId, requestedUserId);
    await this.getBooksByList(list.id, requestedUserId);
    await this.authorizationService.checkUserPermission(list.userId, requestedUserId);

    return this.prismaService.bookListStatus.deleteMany({
      where: {
        listId,
        bookId
      }
    });
  }
}
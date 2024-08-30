import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { AuthorService } from '../author/author.service';
import { GenreService } from '../genre/genre.service';
import { PublisherService } from '../publisher/publisher.service';

@Injectable()
export class ExternalBookService {
  constructor(
    private readonly httpService: HttpService,
    private readonly authorService: AuthorService,
    private readonly genreService: GenreService,
    private readonly publisherService: PublisherService,
  ) {}

  async findBookInExternalApi(title: string) {
    const observable = this.httpService
      .get(`https://www.googleapis.com/books/v1/volumes?q=${title}`)
      .pipe(
        map(async (response) => {
          const books = response.data.items?.slice(0, 10) || [];
          return Promise.all(
            books.map(async (book) => {
              const { volumeInfo } = book;

              const authors = await Promise.all(
                (volumeInfo.authors || []).map(async (authorName: string) => {
                  let author =
                    await this.authorService.getAuthorByName(authorName);
                  if (author.length === 0) {
                    author = [
                      await this.authorService.createAuthor({
                        name: authorName,
                      }),
                    ];
                  }
                  return author[0].id;
                }),
              );

              const genres = await Promise.all(
                (volumeInfo.categories || []).map(async (genreName: string) => {
                  let genre = await this.genreService.getGenreByName(genreName);
                  if (genre.length === 0) {
                    genre = [
                      await this.genreService.createGenre({ name: genreName }),
                    ];
                  }
                  return genre[0].id;
                }),
              );

              let publisher = await this.publisherService.getPublisherByName(
                volumeInfo.publisher || '',
              );
              if (publisher.length === 0) {
                publisher = [
                  await this.publisherService.createPublisher({
                    name: volumeInfo.publisher || '',
                  }),
                ];
              }

              return {
                isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || '',
                title: volumeInfo.title || '',
                subtitle: volumeInfo.subtitle || '',
                summary: volumeInfo.description || '',
                cover_image: volumeInfo.imageLinks?.thumbnail || '',
                published_date: volumeInfo.publishedDate
                  ? new Date(volumeInfo.publishedDate)
                  : null,
                page_count: volumeInfo.pageCount || 0,
                preview_link: volumeInfo.previewLink || '',
                info_link: volumeInfo.infoLink || '',
                author: authors,
                genre: genres,
                publisher: publisher[0].id,
              };
            }),
          );
        }),
      );

    return firstValueFrom(observable);
  }
}

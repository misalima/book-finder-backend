import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Genre } from '@prisma/client';
import { CreateGenreDto } from './dto/createGenre.dto';
import { UpdateGenreDto } from './dto/updateGenre.dto';

@Injectable()
export class GenreService {
  constructor(private prisma: PrismaService) {}

  async createGenre(data: CreateGenreDto): Promise<Genre> {
    return this.prisma.genre.create({
      data,
    });
  }

  async getAllGenres(): Promise<Genre[]> {
    return this.prisma.genre.findMany();
  }

  async getGenreById(id: string): Promise<Genre | null> {
    return this.prisma.genre.findUnique({
      where: { id },
    });
  }

  async updateGenre(id: string, data: UpdateGenreDto): Promise<Genre> {
    return this.prisma.genre.update({
      where: { id },
      data,
    });
  }

  async deleteGenre(id: string): Promise<Genre> {
    return this.prisma.genre.delete({
      where: { id },
    });
  }
}

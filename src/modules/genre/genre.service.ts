import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Genre } from '@prisma/client';
import { CreateGenreDto } from './dto/createGenre.dto';
import { ExistsGenreException } from "./exception/existsGenre.exception";

@Injectable()
export class GenreService {
  constructor(private prisma: PrismaService) {}

  async getAllGenres(){
    return this.prisma.genre.findMany();
  }

  async getGenreById(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      throw new ExistsGenreException('Genre not found');
    }else{
      return genre;
    }
  }

  async getGenreByName(name: string) {
    return this.prisma.genre.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

  async createGenre(data: CreateGenreDto): Promise<Genre> {
    return this.prisma.genre.create({
      data,
    });
  }
}
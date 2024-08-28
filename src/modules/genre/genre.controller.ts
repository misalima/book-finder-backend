import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/createGenre.dto';
import { UpdateGenreDto } from './dto/updateGenre.dto';
import { Genre } from '@prisma/client';
import { JwtAuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('app/genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  async create(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
    return this.genreService.createGenre(createGenreDto);
  }

  @Get()
  async findAll(): Promise<Genre[]> {
    return this.genreService.getAllGenres();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Genre | null> {
    return this.genreService.getGenreById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<Genre> {
    return this.genreService.updateGenre(id, updateGenreDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Genre> {
    return this.genreService.deleteGenre(id);
  }
}

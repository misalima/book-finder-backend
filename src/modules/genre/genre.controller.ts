import { Controller, Get, Param, UseGuards, } from '@nestjs/common';
import { GenreService } from './genre.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('app/genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  async getAll(){
    return this.genreService.getAllGenres();
  }

  @Get(':id')
  async getGenreById(@Param('id') id: string) {
    return this.genreService.getGenreById(id);
  }

  @Get('search/:name')
  async getGenreByName(@Param('name') name: string) {
    return this.genreService.getGenreByName(name);
  }
}

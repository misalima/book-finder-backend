import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { PrismaService } from 'src/prisma.service';
import { GenreController } from './genre.controller';

@Module({
  controllers: [GenreController],
  providers: [GenreService, PrismaService],
  exports: [GenreService]
})
export class GenreModule {}

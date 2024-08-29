import { Module } from '@nestjs/common';
import { UserModule } from "./modules/user/user.module";
import { PrismaService } from "./prisma.service";
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ListModule } from "./modules/list/list.module";
import { GenreModule } from './modules/genre/genre.module';
import { AuthorModule } from "./modules/author/author.module";
import { PublisherModule } from "./modules/publisher/publisher.module";
import { BookModule } from "./modules/book/book.module";

@Module({
  imports: [UserModule, GenreModule, AuthorModule, GenreModule, PublisherModule, BookModule, ListModule, AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt'})],
  providers: [PrismaService],
})
export class AppModule {}

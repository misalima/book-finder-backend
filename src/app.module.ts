import { Module } from '@nestjs/common';
import { UserModule } from "./modules/user/user.module";
import { PrismaService } from "./prisma.service";
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ListModule } from "./modules/list/list.module";
import { GenreModule } from './modules/genre/genre.module';
import { AuthorModule } from "./modules/author/author.module";

@Module({
  imports: [UserModule, GenreModule, AuthorModule, ListModule, AuthModule, PassportModule.register({ defaultStrategy: 'jwt'}), GenreModule],
  providers: [PrismaService],
})
export class AppModule {}

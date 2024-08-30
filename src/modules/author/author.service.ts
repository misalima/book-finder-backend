import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CreateAuthorDto } from "./dto/createAuthor.dto";
import { ExistsAuthorException } from "./exception/existsAuthor.exception";

@Injectable()
export class AuthorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllAuthors() {
    return this.prismaService.author.findMany();
  }

  async getAuthorById(id: string) {
    const author = await this.prismaService.author.findUnique({
      where: { id },
    });

    if (!author) {
      throw new ExistsAuthorException('Author not found');
    }else{
      return author;
    }
  }

  async getAuthorByName(name: string) {
    return this.prismaService.author.findMany({
      where: {
        name:{
          contains: name, mode: 'insensitive' }
      },
    });
  }

  async createAuthor(data: CreateAuthorDto) {
    return this.prismaService.author.create({ data });
  }
}
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CreateAuthorDto } from "./dto/createAuthor.dto";

@Injectable()
export class AuthorService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllAuthors() {
    return this.prismaService.author.findMany();
  }

  async getAuthorById(id: string) {
    return this.prismaService.author.findUnique({
      where: {
        id,
      },
    });
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
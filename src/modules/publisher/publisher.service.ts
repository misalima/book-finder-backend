import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CreatePublisherDto } from "./dto/createPublisher.dto";
import { ExistsGenreException } from "../genre/exception/existsGenre.exception";
import { ExistsPublisherException } from "./exception/existsPublisher.exception";

@Injectable()
export class PublisherService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllPublishers() {
    return this.prismaService.publisher.findMany();
  }

  async getPublisherById(id: string) {
    const publisher = await this.prismaService.publisher.findUnique({
      where: { id }
    });

    if (!publisher) {
      throw new ExistsPublisherException('Publisher not found');
    }else{
      return publisher;
    }
  }

  async getPublisherByName(name: string) {
    return this.prismaService.publisher.findMany({
      where: {
        name: {
          contains: name, mode: 'insensitive'
        }
      }
    });
  }

  async createPublisher(data: CreatePublisherDto) {
    return this.prismaService.publisher.create({ data });
  }
}
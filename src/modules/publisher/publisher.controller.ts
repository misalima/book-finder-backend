import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.guard";
import { PublisherService } from "./publisher.service";

@UseGuards(JwtAuthGuard)
@Controller('app/publisher')

export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get()
  async getAllPublishers() {
    return this.publisherService.getAllPublishers();
  }

  @Get(':id')
  async getPublisherById(@Param('id') id: string) {
    return this.publisherService.getPublisherById(id);
  }

  @Get('search/:name')
  async getPublisherByName(@Param('name') name: string) {
    return this.publisherService.getPublisherByName(name);
  }
}
import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { PublisherController } from "./publisher.controller";
import { PublisherService } from "./publisher.service";

@Module({
  controllers: [PublisherController],
  providers: [PrismaService, PublisherService],
  exports: [PublisherService]
})

export class PublisherModule {}
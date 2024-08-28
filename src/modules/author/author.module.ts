import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { AuthorService } from "./author.service";
import { AuthorController } from "./author.controller";

@Module({
  controllers: [AuthorController],
  providers: [PrismaService, AuthorService],
})

export class AuthorModule {}
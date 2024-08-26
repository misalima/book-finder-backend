import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { AuthorizationService } from "./authorization.service";

@Module({
    providers: [PrismaService, AuthorizationService],
    exports: [AuthorizationService]
})

export class AuthorizationModule {}
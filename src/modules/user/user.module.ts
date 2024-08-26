import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthorizationModule } from "../authorization/authorization.module";

@Module({
    imports: [AuthorizationModule],
    controllers: [UserController],
    providers: [PrismaService, UserService],
    exports: [UserService],
})

export class UserModule {}
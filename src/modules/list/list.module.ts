import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { ListController } from "./list.controller";
import { ListService } from "./list.service";
import { UserModule } from "../user/user.module";
import { AuthorizationModule } from "../authorization/authorization.module";

@Module({
    imports: [UserModule, AuthorizationModule],
    controllers: [ListController],
    providers: [PrismaService, ListService],
})

export class ListModule {}
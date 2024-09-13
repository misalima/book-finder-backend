import { forwardRef, Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { ListController } from "./list.controller";
import { ListService } from "./list.service";
import { UserModule } from "../user/user.module";
import { AuthorizationModule } from "../authorization/authorization.module";
import { StatusModule } from "../status/status.module";

@Module({
    imports: [AuthorizationModule, forwardRef(() => UserModule), forwardRef(() => StatusModule)],
    controllers: [ListController],
    providers: [PrismaService, ListService],
    exports: [ListService],
})

export class ListModule {}
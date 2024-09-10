import { forwardRef, Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthorizationModule } from "../authorization/authorization.module";
import { ListModule } from "../list/list.module";

@Module({
    imports: [AuthorizationModule, forwardRef(() => ListModule)],
    controllers: [UserController],
    providers: [PrismaService, UserService],
    exports: [UserService],
})

export class UserModule {}
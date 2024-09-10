import { forwardRef, Module } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { StatusService } from "./status.service";
import { ListModule } from "../list/list.module";
import { StatusController } from "./status.controller";
import { AuthorizationModule } from "../authorization/authorization.module";

@Module({
    imports: [AuthorizationModule, forwardRef(() => ListModule)],
    controllers: [StatusController],
    providers: [PrismaService, StatusService],
    exports: [StatusService]
})
export class StatusModule {}
import { Module } from '@nestjs/common';
import { UserModule } from "./modules/user/user.module";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [UserModule],
  providers: [PrismaService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { UserModule } from "./modules/user/user.module";
import { PrismaService } from "./prisma.service";
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ListModule } from "./modules/list/list.module";

@Module({
  imports: [UserModule, ListModule, AuthModule, PassportModule.register({ defaultStrategy: 'jwt'})],
  providers: [PrismaService],
})
export class AppModule {}

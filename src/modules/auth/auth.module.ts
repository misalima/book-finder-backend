import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UserModule, PassportModule.register({defaultStrategy: 'jwt'}), JwtModule.register({
    secret: 'secret',
    signOptions: { expiresIn: '400s'}
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule]
})
export class AuthModule {}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { SignInDto } from "./dto/signIn.dto";
import { omit } from 'lodash';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: SignInDto): Promise<{
    user: {
      id: string;
      email: string;
      username: string;
      profile_visibility: number;
      createdAt: Date;
      updatedAt: Date;
    },
    access_token: string;
  }> {
    const user = await this.userService.getUserByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: omit(user, ['password']),
    };
  }
}

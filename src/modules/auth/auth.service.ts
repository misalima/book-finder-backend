import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { SignInDto } from "./dto/signIn.dto";

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService ) {}

    async signIn(data: SignInDto): Promise<{access_token: string}> {
        const user = await this.userService.getUserByUsername(data.username);
        if(!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
   
        const payload = { username: user.username, sub: user.id }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}

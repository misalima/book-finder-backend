import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt'


@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {}

    async signIn(username: string, pass: string): Promise<{access_token}> {
        const user = await this.userService.getUserByUsername(username);
        if(!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
   
        const payload = { username: user.username, sub: user.id }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}

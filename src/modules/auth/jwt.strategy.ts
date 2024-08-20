import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

export interface JwtPayload {
    sub: string;  // userId
    username: string;
    email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor() {

        super({

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            ignoreExpiration: false,

            secretOrKey: 'secret',

        });

    }

    async validate(payload: JwtPayload) {

        return { userId: payload.sub, username: payload.username };

    }

}
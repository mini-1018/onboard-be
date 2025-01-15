import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@src/common/middleware/passport/jwt-payload.interface';
import { JWT_SECRET } from '@/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies['accessToken'],
      ]),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return payload.id;
  }
}

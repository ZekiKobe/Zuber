import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const { sub: id, type } = payload;

    if (type === 'user') {
      const user = await this.authService.validateUser(id);
      if (!user) {
        throw new UnauthorizedException();
      }
      return { ...user, type: 'user' };
    } else if (type === 'driver') {
      const driver = await this.authService.validateDriver(id);
      if (!driver) {
        throw new UnauthorizedException();
      }
      return { ...driver, type: 'driver' };
    }

    throw new UnauthorizedException();
  }
}


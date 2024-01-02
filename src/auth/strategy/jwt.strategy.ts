import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

// auth/strategy/jwt.strategy.ts
@Injectable()
// PassportStrategy(Strategy, '타입명, (default: jwt)')을 상속 받는 것으로 타입명에 그에 대한 strategy
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  // 사용자에 대한 유효성 확인
  async validate(payload: { id: number; email: string }) {
    const user = await this.usersService.getUserById(payload.id);

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    // req.user에 사용자 정보를 담음
    return {
      id: user.id,
      email: user.email,
    };
  }
}

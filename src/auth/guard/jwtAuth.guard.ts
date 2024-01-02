import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// auth/guard/jwtAuth.guard.ts
@Injectable()
// AuthGuard(타입명)을 상속받는 것으로, 타입명을 설정해주면 그에 맞는 strategy를 따라감
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
    return user;
  }
}

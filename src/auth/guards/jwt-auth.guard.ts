import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { IsPublicKey } from '../decorators/public.decorator';
import { AuthInfo, JwtUser } from '../types/jwt.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IsPublicKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic === true) {
      return true;
    }
    return super.canActivate(context); //jwt 유효성 검사
  }

  handleRequest<TUser extends JwtUser>(err: Error, user: TUser, info: AuthInfo): TUser {
    if (err || !user) {
      // 토큰이 만료된 경우
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('로그인 시간이 만료되었습니다. 다시 로그인해 주세요.');
      }

      // 토큰이 유효하지 않은 경우
      if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('유효하지 않은 로그인 시도입니다. 다시 시도해 주세요.');
      }

      throw new UnauthorizedException('로그인에 실패했습니다. 다시 시도해 주세요.');
    }

    return user; //인증된 사용자 정보는 request.user로 설정됨
  }
}

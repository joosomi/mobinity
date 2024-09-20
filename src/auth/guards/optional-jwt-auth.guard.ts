import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { IsPublicKey } from '../decorators/public.decorator';
import { JwtUser } from '../types/jwt.type';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
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

  handleRequest<TUser extends JwtUser>(err: Error, user: TUser): TUser {
    // 인증 오류가 있거나 사용자가 없을 경우 비로그인 상태로 처리
    if (err || !user) {
      // 예외 발생 대신 null을 반환하여 비로그인 상태로 처리
      return null;
    }

    return user; // 인증된 사용자 정보를 request.user로 설정
  }
}

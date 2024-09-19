// JWT Payload 타입 정의
export type JwtPayload = {
  sub: string; // 사용자 ID(uuid)
  username: string;
  email: string;
};

// JWT User 타입 정의
export type JwtUser = {
  id: string;
  username: string;
  email: string;
};

// AuthInfo 타입 정의: 토큰 검증 실패 시 발생하는 에러 정보
export type AuthInfo = {
  name?: string; // 에러 이름 (예: TokenExpiredError)
  message?: string; // 에러 메시지
};

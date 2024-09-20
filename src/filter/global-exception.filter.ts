import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'winston';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  /**
   * 예외 발생 시 호출
   * @param exception
   * @param host
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    //HTTP request, response를 가져옴
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    //예외가 HttpException인 경우 상태 코드를 가져오고,
    //그 외의 경우에는 500 상태 코드로 처리
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    //클라이언트에게 응답할 에러 Response
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }), // 한국 시간으로 변환
      path: request.url,
      message,
    };

    //로거에 에러 정보 기록
    this.logger.error(`${request.method} ${request.url}`, {
      error: errorResponse,
      stack: exception instanceof Error ? exception.stack : 'No stack trace',
    });

    //에러를 JSON 형식으로 전송
    response.status(status).json(errorResponse);
  }
}

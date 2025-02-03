import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // HTTP 요청 객체 가져오기
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // 요청 시작 시간 기록
    const now = Date.now();

    // 요청 처리 후에 처리 시간 계산 및 로그 출력
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        console.log(`[${method}] ${url} - 처리 시간: ${responseTime}ms`);
      }),
    );
  }
}

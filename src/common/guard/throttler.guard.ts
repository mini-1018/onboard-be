import { Injectable, Logger } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';
import { customError } from '../exceptions/customError';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(CustomThrottlerGuard.name);

  async handleRequest(requestProps: ThrottlerRequest) {
    try {
      const request = requestProps.context.switchToHttp().getRequest();
      this.logger.log(`요청 받음 - 경로: ${request.path}, IP: ${request.ip}`);

      const result = await super.handleRequest(requestProps);
      this.logger.log('요청 허용됨');
      return result;
    } catch (error) {
      this.logger.warn(`요청 차단됨: ${error.message}`);
      throw customError(429, '0120');
    }
  }
}

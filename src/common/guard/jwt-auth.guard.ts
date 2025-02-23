import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { customError } from '../exceptions/customError';
import { getToken } from 'next-auth/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies['next-auth.session-token'];

    if (!token) {
      customError(401, '0001');
    }

    try {
      const payload = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!payload) {
        customError(401, '0002');
      }

      request.user = payload;

      return true;
    } catch (error) {
      customError(500, '0003');
    }
  }
}

import jwt from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_SECRET } from '@src/env';

export interface Payload {
  id: number;
}

class TokenUtils {
  createToken(user: Payload, type: 'access' | 'refresh' = 'access'): string {
    const payload = {
      id: user.id,
    };

    const options = {
      expiresIn: type === 'access' ? '1h' : '7d',
    };

    const secret = type === 'access' ? JWT_SECRET : REFRESH_SECRET;

    return jwt.sign(payload, secret, options);
  }
}

export default TokenUtils;

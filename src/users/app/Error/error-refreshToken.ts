import { UnauthorizedException } from '@nestjs/common';

export class RefreshTokenError extends UnauthorizedException {
  constructor() {
    super('Error to  generate refresh token');
  }
}

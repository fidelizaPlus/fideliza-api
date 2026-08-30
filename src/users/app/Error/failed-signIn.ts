import { UnauthorizedException } from '@nestjs/common';

export class FailedSignIn extends UnauthorizedException {
  constructor() {
    super('Signin failed');
  }
}

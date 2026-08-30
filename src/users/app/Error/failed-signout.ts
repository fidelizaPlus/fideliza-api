import { UnauthorizedException } from '@nestjs/common';

export class FailedSignOut extends UnauthorizedException {
  constructor() {
    super('Signout failed');
  }
}

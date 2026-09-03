import { ForbiddenException } from '@nestjs/common';

export class NotManager extends ForbiddenException {
  constructor() {
    super('You are not a manager');
  }
}

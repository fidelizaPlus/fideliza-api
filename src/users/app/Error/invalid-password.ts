import { BadRequestException } from '@nestjs/common';

export class InvalidPassword extends BadRequestException {
  constructor() {
    super('Password must have at least 8 characters');
  }
}

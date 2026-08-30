import { BadRequestException } from '@nestjs/common';

export class InvalidPasswordLength extends BadRequestException {
  constructor() {
    super('Password should have at least 9 characters long');
  }
}

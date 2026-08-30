import { BadRequestException } from '@nestjs/common';

export class InvalidEmail extends BadRequestException {
  constructor() {
    super('Invalid e-mail');
  }
}

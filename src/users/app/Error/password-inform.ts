import { BadRequestException } from '@nestjs/common';

export class InformPassword extends BadRequestException {
  constructor() {
    super('Inform your password');
  }
}
